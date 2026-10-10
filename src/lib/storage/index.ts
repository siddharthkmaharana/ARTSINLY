import fs from "fs";
import path from "path";
import { StorageUploadOptions, UploadedImageResult, StorageProviderType } from "./types";
import { isCloudinaryConfigured, uploadToCloudinary, getCloudinaryOptimizedUrl } from "./cloudinary";
import { isS3Configured, uploadToS3 } from "./s3";

export * from "./types";
export * from "./cloudinary";
export * from "./s3";

/**
 * Detect currently active storage provider
 */
export function getActiveStorageProvider(): StorageProviderType {
  const preferred = (process.env.STORAGE_PROVIDER || "").toLowerCase();
  if (preferred === "cloudinary" && isCloudinaryConfigured()) return "cloudinary";
  if (preferred === "s3" && isS3Configured()) return "s3";

  // Auto-detect based on env variables
  if (isCloudinaryConfigured()) return "cloudinary";
  if (isS3Configured()) return "s3";

  return "local";
}

/**
 * Local file storage fallback for offline / local testing without external API keys
 */
async function uploadToLocalStorage(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  options: StorageUploadOptions = {}
): Promise<UploadedImageResult> {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const cleanFilename = filename.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
  const ext = filename.split(".").pop() || "jpg";
  const uniqueName = `${Date.now()}-${cleanFilename}.${ext}`;
  const filePath = path.join(uploadDir, uniqueName);

  await fs.promises.writeFile(filePath, buffer);

  const localUrl = `/uploads/${uniqueName}`;

  return {
    url: localUrl,
    thumbnailUrl: localUrl,
    publicId: uniqueName,
    format: ext,
    bytes: buffer.length,
    provider: "local",
    createdAt: new Date().toISOString(),
  };
}

/**
 * Unified Image Upload Service
 * Automatically routes to Cloudinary, S3-compatible, or Local Dev Storage
 */
export async function uploadImage(
  buffer: Buffer,
  filename: string,
  mimeType = "image/jpeg",
  options: StorageUploadOptions = {}
): Promise<UploadedImageResult> {
  // Validate allowed image types
  const allowed = options.allowedFormats || ["jpg", "jpeg", "png", "webp", "avif"];
  const ext = (filename.split(".").pop() || "").toLowerCase();
  if (!allowed.includes(ext) && !mimeType.startsWith("image/")) {
    throw new Error(`Unsupported image format .${ext}. Allowed formats: ${allowed.join(", ")}`);
  }

  // Validate file size limit (default 10 MB)
  const maxBytes = options.maxSizeBytes || 10 * 1024 * 1024;
  if (buffer.length > maxBytes) {
    const maxMb = (maxBytes / (1024 * 1024)).toFixed(0);
    throw new Error(`Image exceeds maximum allowed size of ${maxMb}MB.`);
  }

  const provider = getActiveStorageProvider();

  switch (provider) {
    case "cloudinary":
      return uploadToCloudinary(buffer, filename, options);
    case "s3":
      return uploadToS3(buffer, filename, mimeType, options);
    case "local":
    default:
      return uploadToLocalStorage(buffer, filename, mimeType, options);
  }
}

/**
 * Get an optimized delivery URL for artwork, thumbnails, and responsive grids
 */
export function getOptimizedImageUrl(
  url: string,
  options: { width?: number; height?: number; crop?: "fill" | "fit" | "scale" | "thumb" } = {}
): string {
  if (!url) return "";

  // Cloudinary optimization
  if (url.includes("cloudinary.com")) {
    return getCloudinaryOptimizedUrl(url, options);
  }

  // Unsplash CDN parameter optimization
  if (url.includes("images.unsplash.com")) {
    const widthParam = options.width ? `&w=${options.width}` : "";
    return `${url}&auto=format&fit=crop${widthParam}&q=85`;
  }

  // Local / S3 default
  return url;
}

/**
 * Fast helper to obtain a standardized 400x300 thumbnail URL
 */
export function getArtworkThumbnail(url: string): string {
  return getOptimizedImageUrl(url, { width: 400, height: 300, crop: "fill" });
}
