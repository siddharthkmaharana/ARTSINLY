import crypto from "crypto";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  name?: string | null;
}

const AUTH_SECRET = process.env.AUTH_SECRET || "artsinly-dev-secret-key-32-chars-minimum-token";

/**
 * Hash a plain text password using PBKDF2 with a secure salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const iterations = 10000;
  const keyLength = 64;
  const digest = "sha512";
  const hash = crypto.pbkdf2Sync(password, salt, iterations, keyLength, digest).toString("hex");
  return `${salt}:${iterations}:${hash}`;
}

/**
 * Verify a plain text password against a stored PBKDF2 hash
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) return false;
  
  // Format: salt:iterations:hash
  const parts = storedHash.split(":");
  if (parts.length !== 3) {
    // Fallback for simple equality if older unhashed passwords exist in testing
    return password === storedHash;
  }

  const [salt, iterationsStr, originalHash] = parts;
  const iterations = parseInt(iterationsStr, 10);
  const keyLength = 64;
  const digest = "sha512";
  const hash = crypto.pbkdf2Sync(password, salt, iterations, keyLength, digest).toString("hex");
  
  return crypto.timingSafeEqual(Buffer.from(originalHash, "hex"), Buffer.from(hash, "hex"));
}

/**
 * Create a simple signed session token
 */
export function createSessionToken(payload: TokenPayload): string {
  const data = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString("base64url");
  const signature = crypto.createHmac("sha256", AUTH_SECRET).update(data).digest("base64url");
  return `${data}.${signature}`;
}

/**
 * Verify and decode session token
 */
export function verifySessionToken(token: string): TokenPayload | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [data, signature] = parts;
  const expectedSig = crypto.createHmac("sha256", AUTH_SECRET).update(data).digest("base64url");

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf-8"));
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      name: payload.name,
    };
  } catch {
    return null;
  }
}

export type AuthUser = TokenPayload & { id: string };

/**
 * Extract authenticated user session from NextRequest (cookies or Authorization header)
 */
export async function getCurrentUser(req: any): Promise<AuthUser | null> {
  let token =
    req?.cookies?.get?.("artsinly_token")?.value ||
    req?.headers?.get?.("authorization")?.replace("Bearer ", "");

  if (!token && typeof req?.headers?.get === "function") {
    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) {
      const match = cookieHeader.match(/artsinly_token=([^;]+)/);
      if (match) token = match[1];
    }
  }

  if (!token) return null;
  const payload = verifySessionToken(token);
  if (!payload) return null;

  return {
    ...payload,
    id: payload.userId,
  };
}

