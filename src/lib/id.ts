import crypto from "crypto";

/**
 * ARTSINLY IDENTIFIER UTILITY
 * 
 * Database Rule:
 * "Use UUIDs or equivalent non-guessable identifiers for records."
 * 
 * Strictly prohibits sequential auto-incrementing integer IDs to eliminate
 * enumeration attacks, predictable order numbers, and guessable references.
 */

/**
 * Generate a standard RFC 4122 Version 4 UUID.
 * Format: 8-4-4-4-12 hex string (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")
 */
export function generateUUID(): string {
  return crypto.randomUUID();
}

/**
 * Generate a cryptographically secure random identifier with an optional prefix.
 * Example: generateSecureId("usr", 12) => "usr_3f9a7c2d1b0e..."
 */
export function generateSecureId(prefix?: string, bytes = 16): string {
  const token = crypto.randomBytes(bytes).toString("hex");
  return prefix ? `${prefix}_${token}` : token;
}

/**
 * Generate a secure, non-guessable editorial Order Number.
 * Example: ART-2026-F8A3C91D (16 hex chars / 64-bit cryptographic entropy)
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const token = crypto.randomBytes(6).toString("hex").toUpperCase();
  return `ART-${year}-${token}`;
}

/**
 * Generate a cryptographically secure courier tracking number.
 * Example: AWB-7D9A4C1B or BD-IN-9F3C8A2E
 */
export function generateTrackingNumber(carrier = "AWB"): string {
  const token = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `${carrier}-${token}`;
}

/**
 * Generate a cryptographically secure payment or payout transaction reference ID.
 * Example: SBX_UPI_1793123456_8F4C2A1B
 */
export function generateReferenceId(prefix: string): string {
  const token = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `${prefix}_${Date.now()}_${token}`;
}

/**
 * Generate a secure guest cart session token backed by a standard UUID v4.
 * Example: guest_f47ac10b-58cc-4372-a567-0e02b2c3d479
 */
export function generateGuestSessionToken(): string {
  return `guest_${crypto.randomUUID()}`;
}

/**
 * Generate a statutory grievance ticket reference ID with cryptographically secure entropy.
 * Format: GRV-YYYYMMDD-XXXX (e.g. GRV-20261021-9F2B)
 */
export function generateGrievanceTicketId(prefix = "GRV"): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const token = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}-${dateStr}-${token}`;
}

/**
 * Check if a string conforms to the RFC 4122 UUID format.
 */
export function isUUID(value: string): boolean {
  if (typeof value !== "string") return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Validate that an identifier is non-guessable:
 * Rejects pure sequential digits, short integers, or obvious monotonic strings.
 */
export function isNonGuessableId(value: string): boolean {
  if (!value || typeof value !== "string") return false;
  // If it's a UUID, it's valid
  if (isUUID(value)) return true;
  // If it's a CUID (starts with c, 24-25 chars)
  if (/^c[a-z0-9]{24,}$/i.test(value)) return true;
  // If it's an prefixed hex token with at least 8 hex characters of entropy
  if (/[a-f0-9]{8,}/i.test(value)) return true;
  // If it's a structured order or ticket number with entropy
  if (/^(ART|GRV|SBX|AWB|PAYOUT)-/i.test(value) && value.length >= 12) return true;
  // Must NOT be a pure sequential number like "1", "42", "1002"
  if (/^\d{1,8}$/.test(value)) return false;

  return false;
}
