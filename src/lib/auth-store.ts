import fs from "fs";
import path from "path";
import { hashPassword } from "./auth";
import { generateUUID, generateSecureId } from "./id";

export interface FallbackSellerProfile {
  id: string;
  shopName: string;
  slug: string;
  artisanName: string;
  craftTradition: string;
  state: string;
  locality?: string | null;
  giCode?: string | null;
  isVerified: boolean;
  bio?: string | null;
  story?: string | null;
  bannerUrl?: string | null;
  avatarUrl?: string | null;
}

export interface FallbackUser {
  id: string;
  email: string;
  name: string;
  role: "BUYER" | "SELLER" | "ADMIN";
  passwordHash: string;
  phone?: string | null;
  avatar?: string | null;
  sellerProfile?: FallbackSellerProfile | null;
  createdAt?: string;
  updatedAt?: string;
}

// Initial built-in accounts for offline development
const INITIAL_DEMO_USERS: Record<string, FallbackUser> = {
  "admin@artsinly.com": {
    id: "usr_admin_001",
    email: "admin@artsinly.com",
    name: "Master Curator & Administrator",
    role: "ADMIN",
    passwordHash: hashPassword("admin123"),
  },
  "seller@artsinly.com": {
    id: "usr_seller_001",
    email: "seller@artsinly.com",
    name: "Devendra Kumbhar",
    role: "SELLER",
    passwordHash: hashPassword("seller123"),
    sellerProfile: {
      id: "seller_devendra_01",
      shopName: "Devendra Terracotta Works",
      slug: "devendra-terracotta-works",
      artisanName: "Devendra Kumbhar",
      craftTradition: "Terracotta Pottery",
      state: "Gujarat",
      locality: "Kutch",
      giCode: "GI-IN-GJ-449",
      isVerified: true,
      bio: "Heritage terracotta artist practicing ancestral reduction firing in Kutch.",
    },
  },
  "devendra.prajapati@artsinly.com": {
    id: "usr_seller_002",
    email: "devendra.prajapati@artsinly.com",
    name: "Devendra Prajapati",
    role: "SELLER",
    passwordHash: hashPassword("password123"),
    sellerProfile: {
      id: "cmvdxyd9c000lqwxwurax8s29",
      shopName: "Devendra Terracotta Works",
      slug: "devendra-terracotta-works",
      artisanName: "Devendra Prajapati",
      craftTradition: "Terracotta Pottery",
      state: "Gujarat",
      locality: "Kutch",
      giCode: "GI-IN-GJ-449",
      isVerified: true,
    },
  },
  "artisan@artsinly.com": {
    id: "usr_seller_001",
    email: "artisan@artsinly.com",
    name: "Devendra Kumbhar",
    role: "SELLER",
    passwordHash: hashPassword("artisan123"),
    sellerProfile: {
      id: "seller_devendra_01",
      shopName: "Devendra Terracotta Works",
      slug: "devendra-terracotta-works",
      artisanName: "Devendra Kumbhar",
      craftTradition: "Terracotta Pottery",
      state: "Gujarat",
      locality: "Kutch",
      giCode: "GI-IN-GJ-449",
      isVerified: true,
    },
  },
  "buyer@artsinly.com": {
    id: "usr_buyer_001",
    email: "buyer@artsinly.com",
    name: "Aarav Sharma",
    role: "BUYER",
    passwordHash: hashPassword("buyer123"),
  },
};

declare global {
  var __artsinly_auth_users: Record<string, FallbackUser> | undefined;
}

function getPersistencePath(): string {
  try {
    const nextDir = path.join(process.cwd(), ".next");
    if (fs.existsSync(nextDir)) {
      return path.join(nextDir, "dev-auth-users.json");
    }
  } catch {
    // ignore
  }
  return path.join(process.cwd(), ".dev-auth-users.json");
}

function loadPersistedUsers(): Record<string, FallbackUser> {
  const users: Record<string, FallbackUser> = { ...INITIAL_DEMO_USERS };
  try {
    const filePath = getPersistencePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        Object.assign(users, parsed);
      }
    }
  } catch (err) {
    // Non-fatal, fallback to memory
  }
  return users;
}

function persistUsers(users: Record<string, FallbackUser>): void {
  try {
    const filePath = getPersistencePath();
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");
  } catch {
    // Non-fatal if filesystem is read-only
  }
}

function getUserStore(): Record<string, FallbackUser> {
  if (!globalThis.__artsinly_auth_users) {
    globalThis.__artsinly_auth_users = loadPersistedUsers();
  }
  return globalThis.__artsinly_auth_users;
}

/**
 * Retrieve a user by email from the resilient in-memory / local fallback store
 */
export function getFallbackUserByEmail(email: string): FallbackUser | null {
  if (!email) return null;
  const store = getUserStore();
  const normalized = email.toLowerCase().trim();
  return store[normalized] || null;
}

/**
 * Retrieve a user by ID from the resilient in-memory / local fallback store
 */
export function getFallbackUserById(id: string): FallbackUser | null {
  if (!id) return null;
  const store = getUserStore();
  for (const key of Object.keys(store)) {
    if (store[key].id === id) {
      return store[key];
    }
  }
  return null;
}

/**
 * Register a new user in the resilient fallback store
 */
export function registerFallbackUser(data: {
  email: string;
  password: string;
  name?: string;
  role: "BUYER" | "SELLER" | "ADMIN";
  phone?: string;
}): FallbackUser {
  const store = getUserStore();
  const normalizedEmail = data.email.toLowerCase().trim();
  const displayName = data.name?.trim() || normalizedEmail.split("@")[0];
  const userId = `usr_${generateUUID()}`;

  const newUser: FallbackUser = {
    id: userId,
    email: normalizedEmail,
    name: displayName,
    role: data.role,
    passwordHash: hashPassword(data.password),
    phone: data.phone || null,
    avatar: null,
    sellerProfile:
      data.role === "SELLER"
        ? {
            id: `seller_${generateSecureId(undefined, 8)}`,
            shopName: `${displayName}'s Atelier`,
            slug: `${displayName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`,
            artisanName: displayName,
            craftTradition: "Traditional Handicrafts",
            state: "Odisha",
            locality: null,
            giCode: null,
            isVerified: false,
            bio: "Generational artisan custodian registered on Artsinly.",
          }
        : null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store[normalizedEmail] = newUser;
  persistUsers(store);

  return newUser;
}

/**
 * Fast DB timeout guard: if Prisma doesn't respond within `timeoutMs`, fail fast
 * so the application falls back gracefully instead of hanging or throwing 500s.
 */
export async function withDbTimeout<T>(promise: Promise<T>, timeoutMs = 500): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("DB_TIMEOUT")), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timer!);
  }
}

