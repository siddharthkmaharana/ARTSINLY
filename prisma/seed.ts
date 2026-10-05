import { PrismaClient, Role, ProductStatus, OrderStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏺 Starting ARTSINLY PostgreSQL Database Seeding...");

  // 1. Clean existing records in reverse dependency order
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.sellerProfile.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.region.deleteMany();

  console.log("✓ Cleared existing records");

  // 2. Create Categories
  const catPottery = await prisma.category.create({
    data: {
      name: "Terracotta Pottery",
      slug: "terracotta-pottery",
      description: "Hand-thrown earthen vessels, indigenous urns, and sculptural reduction-fired clay crafts.",
      imageUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
    },
  });

  const catBlockPrint = await prisma.category.create({
    data: {
      name: "Block Print",
      slug: "block-print",
      description: "Authentic Ajrakh mud-resist, Sanganeri florals, and hand-loomed vegetable dyed textiles.",
      imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    },
  });

  const catDhokra = await prisma.category.create({
    data: {
      name: "Dhokra Metal",
      slug: "dhokra-metal",
      description: "Ancient 4,000-year lost-wax bell metal casting and handcrafted tribal bronze.",
      imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    },
  });

  const catBluePottery = await prisma.category.create({
    data: {
      name: "Blue Pottery",
      slug: "blue-pottery",
      description: "Powdered quartz stone, Egyptian paste, and cobalt Persian floral glazes.",
      imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    },
  });

  const catWoodCarving = await prisma.category.create({
    data: {
      name: "Wood Carving",
      slug: "wood-carving",
      description: "Hand-chiseled seasoned Sheesham rosewood, architectural palace reliefs, and turnery.",
      imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    },
  });

  // 3. Create Regions
  const regGujarat = await prisma.region.create({
    data: {
      name: "Gujarat",
      slug: "gujarat",
      state: "Gujarat",
      description: "Famed for Kutch terracotta, Ajrakh mud-resist block printing, and Rogan art.",
      imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    },
  });

  const regRajasthan = await prisma.region.create({
    data: {
      name: "Rajasthan",
      slug: "rajasthan",
      state: "Rajasthan",
      description: "Home of Jaipur cobalt quartz blue pottery, Pichwai miniatures, and palace wood carving.",
      imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
    },
  });

  const regBengal = await prisma.region.create({
    data: {
      name: "West Bengal",
      slug: "west-bengal",
      state: "West Bengal",
      description: "Centuries-old lost-wax Dhokra bell metal casting and terracotta temples.",
      imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    },
  });

  const regAP = await prisma.region.create({
    data: {
      name: "Andhra Pradesh",
      slug: "andhra-pradesh",
      state: "Andhra Pradesh",
      description: "Ancient temple Srikalahasti freehand bamboo kalam reed pen painting.",
      imageUrl: "https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=800&q=80",
    },
  });

  // 4. Create Master Users & Sellers
  // Master 1: Devendra Prajapati (Pottery)
  const userDevendra = await prisma.user.create({
    data: {
      email: "devendra.prajapati@artsinly.com",
      name: "Devendra Prajapati",
      role: Role.SELLER,
      phone: "+91 98250 11234",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    },
  });

  const sellerDevendra = await prisma.sellerProfile.create({
    data: {
      userId: userDevendra.id,
      shopName: "Kutch Earthen Guild",
      slug: "devendra-prajapati",
      artisanName: "Devendra Prajapati",
      craftTradition: "Terracotta Pottery",
      state: "Gujarat",
      locality: "Kutch",
      giCode: "GI-IN-GJ-449",
      isVerified: true,
      yearsOfExperience: 34,
      bio: "Master terracotta sculptor preserving indigenous wheel-thrown reduction clay crafts of rural Gujarat.",
      story: "For three generations, Devendra's family has extracted river clay during holy harvest months, mixing it with organic husks to fire iconic vessels in wood kilns.",
      avatarUrl: userDevendra.avatar,
    },
  });

  // Master 2: Meenakshi Rathore (Meenakari & Blue Pottery)
  const userMeenakshi = await prisma.user.create({
    data: {
      email: "meenakshi.rathore@artsinly.com",
      name: "Meenakshi Rathore",
      role: Role.SELLER,
      avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80",
    },
  });

  const sellerMeenakshi = await prisma.sellerProfile.create({
    data: {
      userId: userMeenakshi.id,
      shopName: "Jaipur Gem & Quartz Studio",
      slug: "meenakshi-rathore",
      artisanName: "Meenakshi Rathore",
      craftTradition: "Meenakari Jewellery",
      state: "Rajasthan",
      locality: "Jaipur",
      giCode: "GI-IN-RJ-102",
      isVerified: true,
      yearsOfExperience: 22,
      bio: "Renowned jeweler and ceramicist reviving 16th-century Persian enamel faience.",
      avatarUrl: userMeenakshi.avatar,
    },
  });

  // Master 3: Shankar Lal Jangid (Wood Carving)
  const userShankar = await prisma.user.create({
    data: {
      email: "shankar.jangid@artsinly.com",
      name: "Shankar Lal Jangid",
      role: Role.SELLER,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    },
  });

  const sellerShankar = await prisma.sellerProfile.create({
    data: {
      userId: userShankar.id,
      shopName: "Churu Sheesham Ateliers",
      slug: "shankar-lal-jangid",
      artisanName: "Shankar Lal Jangid",
      craftTradition: "Wood Carving",
      state: "Rajasthan",
      locality: "Churu",
      giCode: "GI-IN-RJ-312",
      isVerified: true,
      yearsOfExperience: 38,
      bio: "National Award-winning master craftsman specializing in floral high-relief rosewood carving.",
      avatarUrl: userShankar.avatar,
    },
  });

  // 5. Create Sample Buyer
  const buyerUser = await prisma.user.create({
    data: {
      email: "collector@artsinly.com",
      name: "Aditi Sen Sharma",
      role: Role.BUYER,
      phone: "+91 98300 44556",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    },
  });

  await prisma.address.create({
    data: {
      userId: buyerUser.id,
      fullName: "Aditi Sen Sharma",
      addressLine1: "Flat 4B, Heritage Residence, 12 Ballygunge Park",
      city: "Kolkata",
      state: "West Bengal",
      postalCode: "700019",
      phone: "+91 98300 44556",
      isDefault: true,
    },
  });

  // 6. Create Products, Variants & Inventory
  // Product 1: Modern Ethnic Ceramic Vase
  const prodVase = await prisma.product.create({
    data: {
      sellerId: sellerDevendra.id,
      categoryId: catPottery.id,
      regionId: regGujarat.id,
      title: "Modern Ethnic Ceramic Vase – Terracotta Vase with Indigenous Pattern",
      slug: "modern-ethnic-ceramic-vase-terracotta-indigenous-pattern",
      description: "Elevate your home decor with this exquisite set of 2 modern ceramic vases, featuring a sculptural, abstract design that brings organic warmth to any contemporary space.",
      story: "Rooted in the indigenous terracotta craft of rural Gujarat, each vase is hand-thrown on manual stone wheels by Devendra Prajapati. Subtle tribal slip motifs are hand-carved before low-temperature reduction firing.",
      craftType: "Terracotta Pottery",
      provenanceTag: "Gujarat",
      giCode: "GI-IN-GJ-449",
      dimensions: "14\" H × 8\" Diameter",
      materials: "Natural riverbed terracotta clay, organic slip glaze, beeswax interior sealant",
      careInstructions: "Wipe with a soft dry or slightly damp cloth. Avoid harsh chemicals.",
      basePricePaise: 12699, // ₹126.99
      status: ProductStatus.PUBLISHED,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=85",
            altText: "Modern Ethnic Ceramic Vase in contemporary living room",
            displayOrder: 0,
            isPrimary: true,
          },
          {
            url: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=85",
            altText: "Handcrafted terracotta workshop details",
            displayOrder: 1,
          },
        ],
      },
    },
  });

  // Variants for Product 1
  const variantVase1 = await prisma.productVariant.create({
    data: {
      productId: prodVase.id,
      sku: "VASE-TERRA-STD",
      name: "Raw Smoked Terracotta",
      colorName: "Raw Terracotta",
      colorHex: "#8A4B38",
      sizeOption: "14\" H × 8\" D",
      pricePaise: 12699, // ₹126.99
      compareAtPricePaise: 15500,
      isDefault: true,
    },
  });

  const variantVase2 = await prisma.productVariant.create({
    data: {
      productId: prodVase.id,
      sku: "VASE-SAND-STD",
      name: "Sand Matte Glaze",
      colorName: "Sand Matte",
      colorHex: "#C8BEAF",
      sizeOption: "14\" H × 8\" D",
      pricePaise: 13999, // ₹139.99
      isDefault: false,
    },
  });

  // Inventories for Product 1
  await prisma.inventory.create({
    data: {
      productId: prodVase.id,
      variantId: variantVase1.id,
      quantity: 12,
      reservedQuantity: 1,
      lowStockThreshold: 3,
      sku: "VASE-TERRA-STD",
    },
  });

  await prisma.inventory.create({
    data: {
      productId: prodVase.id,
      variantId: variantVase2.id,
      quantity: 8,
      reservedQuantity: 0,
      lowStockThreshold: 2,
      sku: "VASE-SAND-STD",
    },
  });

  // Product 2: Hand-Carved Floral High-Relief Sheesham Panel
  const prodClock = await prisma.product.create({
    data: {
      sellerId: sellerShankar.id,
      categoryId: catWoodCarving.id,
      regionId: regRajasthan.id,
      title: "Hand-Carved Floral High-Relief Sheesham Panel",
      slug: "hand-carved-floral-high-relief-sheesham-clock",
      description: "Intricately hand-sculpted from aged Sheesham timber, featuring deep vegetal floral relief in concentric geometric arrangements.",
      story: "Shankar Lal Jangid carves seasoned Rajasthan rosewood with traditional gouges, honoring centuries-old architectural palace relief craft.",
      craftType: "Wood Carving",
      provenanceTag: "Rajasthan",
      giCode: "GI-IN-RJ-312",
      dimensions: "16\" Diameter × 2.5\" D",
      materials: "Solid aged Sheesham timber, organic beeswax polish, silent brass movement",
      careInstructions: "Dust regularly with soft dry cotton cloth. Keep away from excessive humidity.",
      basePricePaise: 70000, // ₹700.00
      status: ProductStatus.PUBLISHED,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=1000&q=85",
            altText: "Hand-Carved Floral High-Relief Sheesham Clock on wall",
            displayOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  const variantClock = await prisma.productVariant.create({
    data: {
      productId: prodClock.id,
      sku: "CLOCK-SHEESHAM-16",
      name: "Seasoned Rosewood 16\"",
      colorName: "Natural Sheesham",
      colorHex: "#5B3A29",
      sizeOption: "16\" Diameter",
      pricePaise: 70000,
      isDefault: true,
    },
  });

  await prisma.inventory.create({
    data: {
      productId: prodClock.id,
      variantId: variantClock.id,
      quantity: 5,
      reservedQuantity: 0,
      lowStockThreshold: 1,
      sku: "CLOCK-SHEESHAM-16",
    },
  });

  // 7. Create Cart for Buyer
  const buyerCart = await prisma.cart.create({
    data: {
      userId: buyerUser.id,
    },
  });

  await prisma.cartItem.create({
    data: {
      cartId: buyerCart.id,
      userId: buyerUser.id,
      productId: prodVase.id,
      variantId: variantVase1.id,
      quantity: 1,
    },
  });

  // 8. Create Sample Completed Order
  const sampleOrder = await prisma.order.create({
    data: {
      orderNumber: "ART-2026-H82K9",
      buyerId: buyerUser.id,
      status: OrderStatus.CONFIRMED,
      currency: "INR",
      subtotalPaise: 12699,
      shippingFeePaise: 0,
      taxPaise: 0,
      totalPaise: 12699,
      addressSnapshot: {
        fullName: "Aditi Sen Sharma",
        addressLine1: "Flat 4B, Heritage Residence, 12 Ballygunge Park",
        city: "Kolkata",
        state: "West Bengal",
        postalCode: "700019",
        phone: "+91 98300 44556",
      },
      items: {
        create: [
          {
            productId: prodVase.id,
            variantId: variantVase1.id,
            sellerId: sellerDevendra.id,
            title: "Modern Ethnic Ceramic Vase – Terracotta Vase with Indigenous Pattern",
            pricePaise: 12699,
            quantity: 1,
          },
        ],
      },
    },
  });

  await prisma.payment.create({
    data: {
      orderId: sampleOrder.id,
      provider: "razorpay",
      referenceId: "pay_N829xZ93kd0",
      amountPaise: 12699,
      status: "COMPLETED",
    },
  });

  // 9. Create Customer Review
  await prisma.review.create({
    data: {
      productId: prodVase.id,
      buyerId: buyerUser.id,
      rating: 5,
      title: "Museum-grade craftsmanship and earthy soul",
      comment:
        "The smoky terracotta reduction texture and subtle tribal markings bring breathtaking organic warmth to our living room shelf. Arrived securely packed in sun-dried straw without a speck of plastic.",
      isVerifiedPurchase: true,
    },
  });

  console.log("✓ Created Users, Sellers, Categories, Products, Variants, Inventory, Cart, Order, and Review");
  console.log("✨ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
