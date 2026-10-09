import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { StorageUploadOptions, UploadedImageResult } from "./types";

const isConfigured = Boolean(
  process.env.S3_ACCESS_KEY_ID &&
  process.env.S3_SECRET_ACCESS_KEY &&
  process.env.S3_BUCKET_NAME
);

const s3Client = isConfigured
  ? new S3Client({
      region: process.env.S3_REGION || "auto",
      endpoint: process.env.S3_ENDPOINT || undefined, // Used for Cloudflare R2 / MinIO / Supabase
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    })
  : null;

export function isS3Configured(): boolean {
  return isConfigured && s3Client !== null;
}

/**
 * Resolve public delivery URL for S3/R2 stored objects
 */
function getPublicUrl(key: string): string {
  if (process.env.S3_PUBLIC_URL) {
    const baseUrl = process.env.S3_PUBLIC_URL.replace(/\/$/, "");
    return `${baseUrl}/${key}`;
  }

  // AWS S3 standard default URL format
  const bucket = process.env.S3_BUCKET_NAME;
  const region = process.env.S3_REGION || "ap-south-1";
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

/**
 * Upload buffer to S3 / Cloudflare R2
 */
export async function uploadToS3(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  options: StorageUploadOptions = {}
): Promise<UploadedImageResult> {
  if (!isS3Configured() || !s3Client) {
    throw new Error("S3 storage is not configured in environment variables.");
  }

  const folder = options.folder || "artsinly/products";
  const cleanFilename = filename.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
  const ext = filename.split(".").pop() || "jpg";
  const key = `${folder}/${Date.now()}-${cleanFilename}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
    CacheControl: "public, max-age=31536000, immutable",
  });

  await s3Client.send(command);
  const publicUrl = getPublicUrl(key);

  return {
    url: publicUrl,
    thumbnailUrl: publicUrl,
    publicId: key,
    format: ext,
    bytes: buffer.length,
    provider: "s3",
    createdAt: new Date().toISOString(),
  };
}

/**
 * Generate a presigned direct upload URL for fast browser-to-S3 uploads
 */
export async function generateS3PresignedUploadUrl(
  filename: string,
  mimeType: string,
  folder = "artsinly/seller-uploads"
): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
  if (!isS3Configured() || !s3Client) {
    throw new Error("S3 storage is not configured.");
  }

  const cleanFilename = filename.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
  const ext = filename.split(".").pop() || "jpg";
  const key = `${folder}/${Date.now()}-${cleanFilename}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    ContentType: mimeType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  const publicUrl = getPublicUrl(key);

  return { uploadUrl, publicUrl, key };
}

/**
 * Delete object from S3
 */
export async function deleteFromS3(key: string): Promise<boolean> {
  if (!isS3Configured() || !s3Client) return false;
  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
      })
    );
    return true;
  } catch (err) {
    console.error("Failed to delete from S3:", err);
    return false;
  }
}
