import { prisma } from "@/lib/prisma";
import { Role, User } from "@prisma/client";

export interface CreateUserInput {
  email: string;
  name?: string;
  passwordHash?: string;
  role?: Role;
  avatar?: string;
  phone?: string;
}

export interface UpdateUserInput {
  name?: string;
  passwordHash?: string;
  role?: Role;
  avatar?: string;
  phone?: string;
}

/**
 * Fetch user by unique ID with optional relations
 */
export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      sellerProfile: true,
      addresses: true,
    },
  });
}

/**
 * Fetch user by unique email address
 */
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    include: {
      sellerProfile: true,
    },
  });
}

/**
 * Create a new user account (Buyer, Seller, or Admin)
 */
export async function createUser(data: CreateUserInput): Promise<User> {
  return prisma.user.create({
    data: {
      email: data.email.toLowerCase().trim(),
      name: data.name,
      passwordHash: data.passwordHash,
      role: data.role ?? Role.BUYER,
      avatar: data.avatar,
      phone: data.phone,
    },
  });
}

/**
 * Update an existing user's details
 */
export async function updateUser(id: string, data: UpdateUserInput): Promise<User> {
  return prisma.user.update({
    where: { id },
    data,
  });
}

/**
 * Get user with full profile, orders, and addresses
 */
export async function getUserWithFullProfile(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      sellerProfile: true,
      addresses: {
        orderBy: { isDefault: "desc" },
      },
      orders: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          items: true,
        },
      },
      reviews: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}
