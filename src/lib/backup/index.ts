import fs from "fs";
import path from "path";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/db/audit";

export interface BackupMetadata {
  filename: string;
  filepath: string;
  timestamp: string;
  checksumSha256: string;
  sizeBytes: number;
  totalRecords: number;
  tableCounts: Record<string, number>;
}

const BACKUP_DIR = path.join(process.cwd(), "backups");

function ensureBackupDirectory() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

/**
 * Creates a comprehensive point-in-time JSON backup snapshot of all PostgreSQL tables
 */
export async function createDatabaseBackup(userId?: string): Promise<BackupMetadata> {
  ensureBackupDirectory();

  const timestamp = new Date().toISOString();
  const fileSafeTimestamp = timestamp.replace(/[:.]/g, "-");
  const filename = `artsinly-backup-${fileSafeTimestamp}.json`;
  const filepath = path.join(BACKUP_DIR, filename);

  // Extract all relational tables in dependency order
  const [
    users,
    sellerProfiles,
    categories,
    regions,
    products,
    productVariants,
    productImages,
    inventory,
    orders,
    orderItems,
    payments,
    shipments,
    reviews,
    auditLogs,
  ] = await Promise.all([
    prisma.user.findMany(),
    prisma.sellerProfile.findMany(),
    prisma.category.findMany(),
    prisma.region.findMany(),
    prisma.product.findMany(),
    prisma.productVariant.findMany(),
    prisma.productImage.findMany(),
    prisma.inventory.findMany(),
    prisma.order.findMany(),
    prisma.orderItem.findMany(),
    prisma.payment.findMany(),
    prisma.shipment.findMany(),
    prisma.review.findMany(),
    prisma.auditLog.findMany(),
  ]);

  const tableCounts: Record<string, number> = {
    users: users.length,
    sellerProfiles: sellerProfiles.length,
    categories: categories.length,
    regions: regions.length,
    products: products.length,
    productVariants: productVariants.length,
    productImages: productImages.length,
    inventory: inventory.length,
    orders: orders.length,
    orderItems: orderItems.length,
    payments: payments.length,
    shipments: shipments.length,
    reviews: reviews.length,
    auditLogs: auditLogs.length,
  };

  const totalRecords = Object.values(tableCounts).reduce((sum, count) => sum + count, 0);

  const payload = {
    metadata: {
      version: "1.0",
      app: "ARTSINLY",
      createdAt: timestamp,
      totalRecords,
      tableCounts,
    },
    data: {
      users,
      sellerProfiles,
      categories,
      regions,
      products,
      productVariants,
      productImages,
      inventory,
      orders,
      orderItems,
      payments,
      shipments,
      reviews,
      auditLogs,
    },
  };

  const content = JSON.stringify(payload, null, 2);
  const checksumSha256 = crypto.createHash("sha256").update(content).digest("hex");

  fs.writeFileSync(filepath, content, "utf-8");
  const stats = fs.statSync(filepath);

  // Log in Audit Trail
  await logAuditEvent({
    userId,
    action: "DATABASE_BACKUP_CREATED",
    details: {
      filename,
      sizeBytes: stats.size,
      totalRecords,
      checksumSha256,
      tableCounts,
    },
  });

  return {
    filename,
    filepath,
    timestamp,
    checksumSha256,
    sizeBytes: stats.size,
    totalRecords,
    tableCounts,
  };
}

/**
 * List all existing backup files in the backups directory
 */
export function listDatabaseBackups(): Array<{
  filename: string;
  sizeBytes: number;
  createdAt: string;
  checksumSha256: string;
}> {
  ensureBackupDirectory();

  const files = fs.readdirSync(BACKUP_DIR).filter((f) => f.endsWith(".json"));
  const backups = [];

  for (const filename of files) {
    const filepath = path.join(BACKUP_DIR, filename);
    const stats = fs.statSync(filepath);

    try {
      const content = fs.readFileSync(filepath, "utf-8");
      const parsed = JSON.parse(content);
      const hash = crypto.createHash("sha256").update(content).digest("hex");

      backups.push({
        filename,
        sizeBytes: stats.size,
        createdAt: parsed.metadata?.createdAt || stats.mtime.toISOString(),
        totalRecords: parsed.metadata?.totalRecords || 0,
        checksumSha256: hash,
      });
    } catch {
      // Corrupt or non-json file
      backups.push({
        filename,
        sizeBytes: stats.size,
        createdAt: stats.mtime.toISOString(),
        totalRecords: 0,
        checksumSha256: "INVALID_CHECKSUM",
      });
    }
  }

  return backups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Verifies the integrity of a backup file
 */
export function verifyBackupIntegrity(filename: string): {
  valid: boolean;
  error?: string;
  totalRecords?: number;
  tableCounts?: Record<string, number>;
} {
  ensureBackupDirectory();
  const filepath = path.join(BACKUP_DIR, filename);

  if (!fs.existsSync(filepath)) {
    return { valid: false, error: "Backup file does not exist" };
  }

  try {
    const content = fs.readFileSync(filepath, "utf-8");
    const parsed = JSON.parse(content);

    if (!parsed.metadata || !parsed.data) {
      return { valid: false, error: "Missing metadata or data section" };
    }

    return {
      valid: true,
      totalRecords: parsed.metadata.totalRecords,
      tableCounts: parsed.metadata.tableCounts,
    };
  } catch (err: any) {
    return { valid: false, error: err.message };
  }
}
