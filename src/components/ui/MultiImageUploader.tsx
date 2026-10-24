"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  X,
  Star,
  ChevronLeft,
  ChevronRight,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Cloud,
  Eye,
  FileImage,
} from "lucide-react";

export interface CraftImageItem {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
  displayOrder: number;
}

interface MultiImageUploaderProps {
  images: CraftImageItem[];
  onChange: (images: CraftImageItem[]) => void;
  folder?: string;
  maxImages?: number;
  label?: string;
  helperText?: string;
}

export default function MultiImageUploader({
  images,
  onChange,
  folder = "artsinly/products",
  maxImages = 8,
  label = "Product Photography & Gallery",
  helperText = "Upload multiple high-resolution photos (front, angle, close-up details, artisan hallmark). First or starred image is the primary cover.",
}: MultiImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [urlAltInput, setUrlAltInput] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadSingleFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || `Failed to upload ${file.name}`);
    }

    return data.image.url;
  };

  const handleFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    if (images.length + files.length > maxImages) {
      setUploadError(`Maximum ${maxImages} images allowed. Please select fewer images.`);
      return;
    }

    const validFiles: File[] = [];
    for (const f of files) {
      if (!f.type.startsWith("image/")) {
        setUploadError(`File ${f.name} is not a valid image.`);
        return;
      }
      if (f.size > 10 * 1024 * 1024) {
        setUploadError(`File ${f.name} exceeds 10MB limit.`);
        return;
      }
      validFiles.push(f);
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadPromises = validFiles.map((file) => uploadSingleFile(file));
      const uploadedUrls = await Promise.all(uploadPromises);

      const newItems: CraftImageItem[] = uploadedUrls.map((url, idx) => ({
        id: `img_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
        url,
        altText: "",
        isPrimary: images.length === 0 && idx === 0,
        displayOrder: images.length + idx,
      }));

      const updated = [...images, ...newItems];
      // ensure at least one primary
      if (!updated.some((img) => img.isPrimary) && updated.length > 0) {
        updated[0].isPrimary = true;
      }
      onChange(updated);
    } catch (err: any) {
      console.error("Multi-image upload error:", err);
      setUploadError(err.message || "Failed to upload some images. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleUrlAdd = () => {
    if (!urlInput.trim()) return;
    if (images.length >= maxImages) {
      setUploadError(`Maximum ${maxImages} images allowed.`);
      return;
    }

    const newItem: CraftImageItem = {
      id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      url: urlInput.trim(),
      altText: urlAltInput.trim(),
      isPrimary: images.length === 0,
      displayOrder: images.length,
    };

    const updated = [...images, newItem];
    if (!updated.some((img) => img.isPrimary) && updated.length > 0) {
      updated[0].isPrimary = true;
    }
    onChange(updated);
    setUrlInput("");
    setUrlAltInput("");
    setUploadError(null);
  };

  const setPrimary = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    onChange(updated);
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
      updated[0].isPrimary = true;
    }
    const reordered = updated.map((img, i) => ({ ...img, displayOrder: i }));
    onChange(reordered);
  };

  const moveImage = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const copy = [...images];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    const reordered = copy.map((img, i) => ({ ...img, displayOrder: i }));
    onChange(reordered);
  };

  return (
    <div className="space-y-3">
      {/* Header with Mode Toggle & Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="block text-xs font-semibold text-[#1E1E1C]">
            {label}
          </label>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EFEBE4] text-[#6E6A62]">
            {images.length}/{maxImages}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              mode === "upload"
                ? "bg-[#1E1E1C] text-white font-medium shadow-xs"
                : "text-[#6E6A62] hover:text-[#1E1E1C] bg-[#EFEBE4]"
            }`}
          >
            File Upload
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              mode === "url"
                ? "bg-[#1E1E1C] text-white font-medium shadow-xs"
                : "text-[#6E6A62] hover:text-[#1E1E1C] bg-[#EFEBE4]"
            }`}
          >
            Direct URL
          </button>
        </div>
      </div>

      {/* Upload Zone / Direct URL Zone */}
      {mode === "upload" ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-[#C2410C] bg-[#FFF8F3]"
              : "border-[#D5CFC5] hover:border-[#1E1E1C] bg-[#FAF7F2]/60 hover:bg-[#FAF7F2]"
          } ${isUploading ? "pointer-events-none opacity-70" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files);
            }}
            className="hidden"
          />

          {isUploading ? (
            <div className="py-3 space-y-2">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#C2410C]" />
              <p className="text-xs font-medium text-[#1E1E1C]">
                Uploading craft images to Cloud Storage...
              </p>
              <p className="text-[11px] text-[#8C877E]">
                Optimizing thumbnails & responsive variants
              </p>
            </div>
          ) : (
            <div className="py-2 space-y-1.5">
              <div className="w-9 h-9 rounded-full bg-[#EAE5DD] mx-auto flex items-center justify-center text-[#1E1E1C]">
                <Upload className="w-4 h-4 text-[#C2410C]" />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-[#1E1E1C]">
                  Click to select multiple photos
                </span>
                <span className="text-[#8C877E]"> or drag and drop here</span>
              </div>
              <p className="text-[10px] text-[#8C877E]">
                PNG, JPG, WEBP up to 10MB each. Reorder photos by moving them left/right.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-3 bg-[#FAF7F2] border border-[#DDD5C8] rounded-xl space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <input
              type="url"
              placeholder="https://images.unsplash.com/... or cloud image URL"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="sm:col-span-8 text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C]"
            />
            <input
              type="text"
              placeholder="Alt text (e.g. angle view)"
              value={urlAltInput}
              onChange={(e) => setUrlAltInput(e.target.value)}
              className="sm:col-span-4 text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C]"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleUrlAdd}
              disabled={!urlInput.trim() || images.length >= maxImages}
              className="px-3.5 py-1.5 bg-[#1E1E1C] text-white text-xs font-semibold rounded-lg hover:bg-[#383734] transition-colors disabled:opacity-50 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Image</span>
            </button>
          </div>
        </div>
      )}

      {/* Upload Error Notification */}
      {uploadError && (
        <div className="flex items-center gap-2 text-xs text-[#B91C1C] bg-red-50 p-2.5 rounded-lg border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Uploaded Images Gallery Grid & Reordering */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-[#7A756D]">
            <span>
              <strong>{images.length}</strong> {images.length === 1 ? "photo" : "photos"} uploaded · Star to set as primary cover photo
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img, index) => (
              <div
                key={img.id}
                className={`relative group bg-white border rounded-xl overflow-hidden shadow-xs transition-all ${
                  img.isPrimary
                    ? "border-[#C2410C] ring-2 ring-[#C2410C]/20"
                    : "border-[#DDD5C8] hover:border-[#1E1E1C]"
                }`}
              >
                {/* Thumbnail Image */}
                <div className="aspect-square bg-[#ECE6DC] relative overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.altText || `Product Image ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Primary Cover Badge */}
                  {img.isPrimary && (
                    <div className="absolute top-1.5 left-1.5 bg-[#C2410C] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-white" />
                      <span>COVER</span>
                    </div>
                  )}

                  {/* Quick Action Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPreviewImage(img.url)}
                      className="p-1.5 bg-white/90 text-[#1E1E1C] rounded-full hover:bg-white transition-colors"
                      title="Preview full size"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    {!img.isPrimary && (
                      <button
                        type="button"
                        onClick={() => setPrimary(index)}
                        className="p-1.5 bg-white/90 text-[#C2410C] rounded-full hover:bg-white transition-colors"
                        title="Set as Primary Cover"
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-1.5 bg-white/90 text-[#B91C1C] rounded-full hover:bg-white transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Footer Controls: Reordering & Primary toggle */}
                <div className="p-1.5 bg-[#FAF7F2] border-t border-[#EFEBE4] flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveImage(index, "left")}
                      className="p-1 text-[#6E6A62] hover:text-[#1E1E1C] disabled:opacity-30 disabled:hover:text-[#6E6A62] rounded"
                      title="Move backward"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                    <span className="font-mono text-[#8C877E] px-1">
                      #{index + 1}
                    </span>
                    <button
                      type="button"
                      disabled={index === images.length - 1}
                      onClick={() => moveImage(index, "right")}
                      className="p-1 text-[#6E6A62] hover:text-[#1E1E1C] disabled:opacity-30 disabled:hover:text-[#6E6A62] rounded"
                      title="Move forward"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  {!img.isPrimary ? (
                    <button
                      type="button"
                      onClick={() => setPrimary(index)}
                      className="text-[9px] text-[#C2410C] hover:underline font-medium"
                    >
                      Make Cover
                    </button>
                  ) : (
                    <span className="text-[9px] text-emerald-700 font-semibold">
                      Primary
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox / Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] p-2 bg-white rounded-xl shadow-2xl">
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute -top-3 -right-3 p-1.5 bg-[#1E1E1C] text-white rounded-full hover:bg-black transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={previewImage}
              alt="Enlarged Craft Preview"
              className="max-h-[80vh] w-auto object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      <p className="text-[11px] text-[#8C877E] leading-relaxed">{helperText}</p>
    </div>
  );
}
