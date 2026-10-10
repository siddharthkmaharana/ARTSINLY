export type StorageProviderType = "cloudinary" | "s3" | "local";

export interface StorageUploadOptions {
  folder?: string;
  tags?: string[];
  allowedFormats?: string[];
  maxSizeBytes?: number;
  generateThumbnail?: boolean;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
}

export interface UploadedImageResult {
  url: string;
  thumbnailUrl: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  provider: StorageProviderType;
  createdAt: string;
}

export interface ImageTransformationOptions {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "scale" | "thumb" | "crop";
  quality?: number | "auto";
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
}
