import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import {
  getOrCreateCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from "@/lib/db/carts";
import { generateGuestSessionToken } from "@/lib/id";

/**
 * GET /api/cart
 */
export async function GET(req: NextRequest) {
  try {
    const token =
      req.cookies.get("artsinly_token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    const payload = token ? verifySessionToken(token) : null;
    const sessionToken = req.cookies.get("artsinly_guest_cart")?.value;

    if (!payload && !sessionToken) {
      return NextResponse.json({ items: [] });
    }

    const cart = await getOrCreateCart(payload?.userId, sessionToken);
    return NextResponse.json({ cart });
  } catch (error: any) {
    console.error("Cart GET error:", error);
    return NextResponse.json({ items: [] });
  }
}

/**
 * POST /api/cart - Add or update cart item
 */
export async function POST(req: NextRequest) {
  try {
    const token =
      req.cookies.get("artsinly_token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    const payload = token ? verifySessionToken(token) : null;
    let sessionToken = req.cookies.get("artsinly_guest_cart")?.value;

    const response = NextResponse.next();
    if (!payload && !sessionToken) {
      sessionToken = generateGuestSessionToken();
      response.cookies.set("artsinly_guest_cart", sessionToken, {
        httpOnly: true,
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      });
    }

    const cart = await getOrCreateCart(payload?.userId, sessionToken);
    const body = await req.json();
    const { productId, quantity = 1, variantId } = body;

    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const item = await addItemToCart({
      cartId: cart.id,
      productId,
      quantity: Number(quantity),
      variantId,
      userId: payload?.userId,
    });

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    console.error("Cart POST error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update cart" },
      { status: 500 }
    );
  }
}
