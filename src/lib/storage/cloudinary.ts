import { v2 as cloudinary } from "cloudinary";
import { StorageUploadOptions, UploadedImageResult, ImageTransformationOptions } from "./types";

const isConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export function isCloudinaryConfigured(): boolean {
  return isConfigured;
}

/**
 * Upload a binary buffer to Cloudinary
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  filename: string,
  options: StorageUploadOptions = {}
): Promise<UploadedImageResult> {
  if (!isConfigured) {
    throw new Error("Cloudinary credentials are not configured in environment variables.");
  }

  const folder = options.folder || "artsinly/products";
  const publicId = `${folder}/${Date.now()}-${filename.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_")}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        folder,
        tags: options.tags || ["artsinly", "handcrafted"],
        resource_type: "image",
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary upload failed with empty result."));
        }

        // Generate high-quality editorial thumbnail
        const thumbWidth = options.thumbnailWidth || 400;
        const thumbHeight = options.thumbnailHeight || 300;
        const thumbnailUrl = cloudinary.url(result.public_id, {
          width: thumbWidth,
          height: thumbHeight,
          crop: "fill",
          gravity: "auto",
          fetch_format: "auto",
          quality: "auto:good",
          secure: true,
        });

        resolve({
          url: result.secure_url,
          thumbnailUrl,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
          provider: "cloudinary",
          createdAt: result.created_at || new Date().toISOString(),
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Transform Cloudinary image URL on the fly (cropping, resizing, auto format)
 */
export function getCloudinaryOptimizedUrl(
  publicIdOrUrl: string,
  options: ImageTransformationOptions = {}
): string {
  if (!isConfigured) return publicIdOrUrl;

  // Extract public ID if full Cloudinary URL is passed
  let publicId = publicIdOrUrl;
  const match = publicIdOrUrl.match(/\/upload\/(?:v\d+\/)?([^.]+)/);
  if (match) {
    publicId = match[1];
  }

  return cloudinary.url(publicId, {
    width: options.width,
    height: options.height,
    crop: options.crop || "fill",
    gravity: "auto",
    quality: options.quality || "auto",
    fetch_format: options.format || "auto",
    secure: true,
  });
}

/**
 * Delete image from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  if (!isConfigured) return false;
  try {
    const res = await cloudinary.uploader.destroy(publicId);
    return res.result === "ok";
  } catch (err) {
    console.error("Failed to delete from Cloudinary:", err);
    return false;
  }
}
