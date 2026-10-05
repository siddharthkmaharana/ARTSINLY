import { prisma } from "@/lib/prisma";
import { Cart, CartItem } from "@prisma/client";

/**
 * Retrieve an existing cart or create a new one (by userId or guest sessionToken)
 */
export async function getOrCreateCart(
  userId?: string,
  sessionToken?: string
): Promise<Cart & { items: CartItem[] }> {
  if (!userId && !sessionToken) {
    throw new Error("Either userId or sessionToken must be provided to get or create a cart");
  }

  // 1. Try to find by userId if user is authenticated
  if (userId) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true } },
              },
            },
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { where: { isPrimary: true } },
                },
              },
              variant: true,
            },
          },
        },
      });
    }

    return cart;
  }

  // 2. Otherwise find by guest sessionToken
  let cart = await prisma.cart.findUnique({
    where: { sessionToken },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { where: { isPrimary: true } },
            },
          },
          variant: true,
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { sessionToken },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true } },
              },
            },
            variant: true,
          },
        },
      },
    });
  }

  return cart;
}

/**
 * Add an item to the cart (or increment quantity if already present)
 */
export async function addItemToCart(params: {
  cartId: string;
  productId: string;
  quantity: number;
  variantId?: string;
  userId?: string;
}) {
  const { cartId, productId, quantity, variantId, userId } = params;

  return prisma.cartItem.upsert({
    where: {
      cartId_productId_variantId: {
        cartId,
        productId,
        variantId: variantId ?? "",
      },
    },
    update: {
      quantity: { increment: quantity },
    },
    create: {
      cartId,
      productId,
      variantId,
      quantity,
      userId,
    },
    include: {
      product: true,
      variant: true,
    },
  });
}

/**
 * Update the quantity of a specific cart item
 */
export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
): Promise<CartItem | null> {
  if (quantity <= 0) {
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
    return null;
  }

  return prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });
}

/**
 * Remove an item from the cart
 */
export async function removeCartItem(cartItemId: string): Promise<CartItem> {
  return prisma.cartItem.delete({
    where: { id: cartItemId },
  });
}

/**
 * Clear all items in a cart
 */
export async function clearCart(cartId: string) {
  return prisma.cartItem.deleteMany({
    where: { cartId },
  });
}

/**
 * Merge an anonymous guest session cart into an authenticated user's cart on login
 */
export async function mergeGuestCart(guestSessionToken: string, userId: string) {
  const guestCart = await prisma.cart.findUnique({
    where: { sessionToken: guestSessionToken },
    include: { items: true },
  });

  if (!guestCart || guestCart.items.length === 0) return null;

  const userCart = await getOrCreateCart(userId);

  await prisma.$transaction(async (tx) => {
    for (const item of guestCart.items) {
      await tx.cartItem.upsert({
        where: {
          cartId_productId_variantId: {
            cartId: userCart.id,
            productId: item.productId,
            variantId: item.variantId ?? "",
          },
        },
        update: {
          quantity: { increment: item.quantity },
        },
        create: {
          cartId: userCart.id,
          userId,
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        },
      });
    }

    // Delete guest cart after merge
    await tx.cart.delete({
      where: { id: guestCart.id },
    });
  });

  return getOrCreateCart(userId);
}
