import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth";
import {
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  withDbTimeout,
} from "@/lib/auth-store";

function getAuthUserId(req: NextRequest): string | null {
  const token =
    req.cookies.get("artsinly_token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) return null;
  const payload = verifySessionToken(token);
  return payload ? payload.userId : null;
}

/**
 * GET /api/user/addresses - List addresses for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let addresses: any[] = [];
    try {
      addresses = await withDbTimeout(
        prisma.address.findMany({
          where: { userId },
          orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
        }),
        600
      );
    } catch {
      // Prisma offline or timeout, use fallback store
    }

    if (!addresses || addresses.length === 0) {
      const fallbackList = getUserAddresses(userId);
      if (fallbackList && fallbackList.length > 0) {
        addresses = fallbackList;
      }
    }

    return NextResponse.json({ addresses: addresses || [] });
  } catch (error: any) {
    console.error("Addresses GET error:", error);
    return NextResponse.json({ addresses: [] });
  }
}

/**
 * POST /api/user/addresses - Add a new address for the authenticated user
 */
export async function POST(req: NextRequest) {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      fullName,
      addressLine1,
      addressLine2 = "",
      city,
      state,
      postalCode,
      country = "India",
      phone,
      isDefault = false,
    } = body;

    if (!fullName || !addressLine1 || !city || !state || !postalCode || !phone) {
      return NextResponse.json(
        { error: "Full name, street address, city, state, PIN code, and phone number are required." },
        { status: 400 }
      );
    }

    let createdAddress: any = null;
    try {
      // Check existing count to decide if this should be default
      const existingCount = await withDbTimeout(
        prisma.address.count({ where: { userId } }),
        500
      );

      const makeDefault = Boolean(isDefault || existingCount === 0);

      if (makeDefault) {
        await withDbTimeout(
          prisma.address.updateMany({
            where: { userId },
            data: { isDefault: false },
          }),
          500
        );
      }

      createdAddress = await withDbTimeout(
        prisma.address.create({
          data: {
            userId,
            fullName: fullName.trim(),
            addressLine1: addressLine1.trim(),
            addressLine2: addressLine2?.trim() || null,
            city: city.trim(),
            state: state.trim(),
            postalCode: postalCode.trim(),
            country: country.trim() || "India",
            phone: phone.trim(),
            isDefault: makeDefault,
          },
        }),
        600
      );
    } catch {
      // Fallback offline storage
      createdAddress = addUserAddress(userId, {
        fullName: fullName.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2?.trim() || null,
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: country.trim() || "India",
        phone: phone.trim(),
        isDefault: Boolean(isDefault),
      });
    }

    return NextResponse.json({ address: createdAddress }, { status: 201 });
  } catch (error: any) {
    console.error("Addresses POST error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save address" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user/addresses - Update an existing address
 */
export async function PUT(req: NextRequest) {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      id,
      fullName,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      phone,
      isDefault,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
    }

    let updatedAddress: any = null;
    try {
      if (isDefault) {
        await withDbTimeout(
          prisma.address.updateMany({
            where: { userId },
            data: { isDefault: false },
          }),
          500
        );
      }

      updatedAddress = await withDbTimeout(
        prisma.address.update({
          where: { id, userId },
          data: {
            ...(fullName ? { fullName: fullName.trim() } : {}),
            ...(addressLine1 ? { addressLine1: addressLine1.trim() } : {}),
            ...(addressLine2 !== undefined ? { addressLine2: addressLine2?.trim() || null } : {}),
            ...(city ? { city: city.trim() } : {}),
            ...(state ? { state: state.trim() } : {}),
            ...(postalCode ? { postalCode: postalCode.trim() } : {}),
            ...(country ? { country: country.trim() } : {}),
            ...(phone ? { phone: phone.trim() } : {}),
            ...(isDefault !== undefined ? { isDefault: Boolean(isDefault) } : {}),
          },
        }),
        600
      );
    } catch {
      // Fallback
      updatedAddress = updateUserAddress(userId, id, {
        ...(fullName ? { fullName: fullName.trim() } : {}),
        ...(addressLine1 ? { addressLine1: addressLine1.trim() } : {}),
        ...(addressLine2 !== undefined ? { addressLine2: addressLine2?.trim() || null } : {}),
        ...(city ? { city: city.trim() } : {}),
        ...(state ? { state: state.trim() } : {}),
        ...(postalCode ? { postalCode: postalCode.trim() } : {}),
        ...(country ? { country: country.trim() } : {}),
        ...(phone ? { phone: phone.trim() } : {}),
        ...(isDefault !== undefined ? { isDefault: Boolean(isDefault) } : {}),
      });
    }

    return NextResponse.json({ address: updatedAddress });
  } catch (error: any) {
    console.error("Addresses PUT error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update address" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user/addresses - Delete an address
 */
export async function DELETE(req: NextRequest) {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await req.json();
        id = body.id;
      } catch {
        // no body
      }
    }

    if (!id) {
      return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
    }

    try {
      await withDbTimeout(
        prisma.address.delete({
          where: { id, userId },
        }),
        600
      );
    } catch {
      deleteUserAddress(userId, id);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Addresses DELETE error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete address" },
      { status: 500 }
    );
  }
}

