import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth";
import { sendSellerOrderAlertEmail } from "@/lib/email";

function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ART-${year}-${randomStr}`;
}

/**
 * GET /api/orders - Get orders for the logged-in buyer
 */
export async function GET(req: NextRequest) {
  try {
    const token =
      req.cookies.get("artsinly_token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ orders: [] });
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ orders: [] });
    }

    const orders = await prisma.order.findMany({
      where: { buyerId: payload.userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true } },
              },
            },
            seller: true,
          },
        },
        shipments: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error("Orders GET error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/orders - Create a new order with inventory deduction and shipment record
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items,
      shippingAddress,
      buyerEmail,
      buyerName,
      buyerPhone,
      shippingFeePaise = 0,
      taxPaise = 0,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty. Please select handcrafted items to order." },
        { status: 400 }
      );
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.addressLine1) {
      return NextResponse.json(
        { error: "Complete delivery address is required." },
        { status: 400 }
      );
    }

    // 1. Identify Buyer: Authenticated or Guest (auto-provision user)
    let buyerId: string;
    const token =
      req.cookies.get("artsinly_token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    const payload = token ? verifySessionToken(token) : null;

    if (payload) {
      buyerId = payload.userId;
    } else {
      const email = (buyerEmail || "guest@artsinly.com").trim().toLowerCase();
      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name: buyerName || shippingAddress.fullName || "Esteemed Collector",
            phone: buyerPhone || shippingAddress.phone || "",
            role: "BUYER",
          },
        });
      }
      buyerId = user.id;
    }

    // 2. Validate and enrich order items with database products and inventory checks
    const enrichedItems: Array<{
      productId: string;
      variantId?: string;
      sellerId: string;
      title: string;
      pricePaise: number;
      quantity: number;
      sellerEmail?: string;
      sellerName?: string;
    }> = [];

    // Fallback seller in case custom product without sellerId
    const defaultSeller = await prisma.sellerProfile.findFirst() || await prisma.sellerProfile.create({
      data: {
        shopName: "ARTSINLY Master Guild",
        slug: "artsinly-master-guild",
        artisanName: "Master Artisan Collective",
        craftTradition: "Heritage Crafts",
        state: "Rajasthan",
        locality: "Jaipur",
        giCode: "GI-IN-RJ-001",
        user: {
          create: {
            email: "guild@artsinly.com",
            name: "Master Artisan Collective",
            role: "SELLER",
          },
        },
      },
    });

    for (const item of items) {
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: {
          seller: { include: { user: true } },
          variants: true,
          inventory: true,
        },
      });

      if (product) {
        // Check stock
        const currentStock = product.inventory[0]?.quantity ?? 10;
        if (currentStock < quantity) {
          return NextResponse.json(
            {
              error: `Insufficient stock for "${product.title}". Only ${currentStock} pieces available.`,
            },
            { status: 400 }
          );
        }

        enrichedItems.push({
          productId: product.id,
          variantId: product.variants[0]?.id,
          sellerId: product.sellerId || defaultSeller.id,
          title: product.title,
          pricePaise: item.pricePaise || product.basePricePaise,
          quantity,
          sellerEmail: product.seller?.user?.email || "artisan@artsinly.com",
          sellerName: product.seller?.artisanName || product.seller?.shopName || "Master Artisan",
        });
      } else {
        // Fallback for demo mock product ID
        enrichedItems.push({
          productId: item.productId,
          sellerId: defaultSeller.id,
          title: item.title || "Handcrafted Heritage Art Piece",
          pricePaise: item.pricePaise || 12699,
          quantity,
          sellerEmail: "artisan@artsinly.com",
          sellerName: defaultSeller.artisanName || undefined,
        });
      }
    }

    const subtotalPaise = enrichedItems.reduce(
      (sum, item) => sum + item.pricePaise * item.quantity,
      0
    );
    const totalPaise = subtotalPaise + shippingFeePaise + taxPaise;
    const orderNumber = generateOrderNumber();

    // 3. Atomically create Order, OrderItems, decrement Inventory, and create Shipment
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          buyerId,
          totalPaise,
          subtotalPaise,
          shippingFeePaise,
          taxPaise,
          status: "PENDING",
          addressSnapshot: shippingAddress,
          items: {
            create: enrichedItems.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              sellerId: item.sellerId,
              title: item.title,
              pricePaise: item.pricePaise,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // Deduct inventory for items in DB
      for (const item of enrichedItems) {
        await tx.inventory.updateMany({
          where: { productId: item.productId },
          data: {
            quantity: { decrement: item.quantity },
          },
        });
      }

      // Create initial Shipment record
      await tx.shipment.create({
        data: {
          orderId: newOrder.id,
          carrier: "Insured Pan-India Express",
          status: "LABEL_CREATED",
          trackingNumber: `AWB-${orderNumber.replace(/[^A-Z0-9]/g, "")}`,
        },
      });

      return newOrder;
    });

    // 4. Trigger Seller Order Alerts (async / non-blocking)
    for (const item of enrichedItems) {
      if (item.sellerEmail) {
        sendSellerOrderAlertEmail({
          sellerEmail: item.sellerEmail,
          sellerName: item.sellerName || "Master Artisan",
          orderNumber: order.orderNumber,
          items: [
            {
              title: item.title,
              quantity: item.quantity,
              pricePaise: item.pricePaise,
            },
          ],
          shippingAddress: {
            fullName: shippingAddress.fullName,
            addressLine1: shippingAddress.addressLine1,
            city: shippingAddress.city,
            state: shippingAddress.state,
            postalCode: shippingAddress.postalCode,
          },
        }).catch((err) => console.error("Error sending seller alert:", err));
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalPaise: order.totalPaise,
        status: order.status,
      },
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to place order. Please try again." },
      { status: 500 }
    );
  }
}
