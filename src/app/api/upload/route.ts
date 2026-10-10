import { NextRequest, NextResponse } from "next/server";
import {
  uploadImage,
  getActiveStorageProvider,
  isCloudinaryConfigured,
  isS3Configured,
} from "@/lib/storage";

export const dynamic = "force-dynamic";

/**
 * GET /api/upload - Health check & active storage provider info
 */
export async function GET() {
  const provider = getActiveStorageProvider();
  return NextResponse.json({
    status: "ok",
    activeProvider: provider,
    cloudinaryConfigured: isCloudinaryConfigured(),
    s3Configured: isS3Configured(),
    supportedFormats: ["image/jpeg", "image/png", "image/webp", "image/avif"],
    maxSizeMb: 10,
  });
}

/**
 * POST /api/upload - Handle artwork, thumbnail, and seller uploads
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "artsinly/seller-uploads";
    const altText = (formData.get("altText") as string) || "";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file provided in request." },
        { status: 400 }
      );
    }

    // Validate mime type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid file type '${file.type}'. Please upload JPG, PNG, WEBP, or AVIF.`,
        },
        { status: 400 }
      );
    }

    // Validate size (10 MB max)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "File size exceeds 10MB limit. Please compress or select a smaller image.",
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload through unified storage provider
    const result = await uploadImage(buffer, file.name, file.type, {
      folder,
      generateThumbnail: true,
      thumbnailWidth: 400,
      thumbnailHeight: 300,
    });

    return NextResponse.json({
      success: true,
      image: {
        ...result,
        altText,
        originalName: file.name,
      },
    });
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to upload image. Please try again.",
      },
      { status: 500 }
    );
  }
}
