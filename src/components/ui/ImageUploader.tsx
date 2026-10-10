"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, CheckCircle2, AlertCircle, Loader2, Sparkles, Cloud } from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  helperText?: string;
}

export default function ImageUploader({
  value,
  onChange,
  folder = "artsinly/seller-uploads",
  label = "Artwork & Product Photography",
  helperText = "Upload high-resolution photography (JPG, PNG, WEBP up to 10MB). Stored in Cloudinary / S3.",
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image file exceeds the 10MB limit.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image.");
      }

      onChange(data.image.url);
      setUrlInput(data.image.url);
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(err.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
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
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUploadError(null);
    }
  };

  const handleRemove = () => {
    onChange("");
    setUrlInput("");
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-[#1E1E1C]">
          {label}
        </label>
        <div className="flex items-center gap-2 text-[11px]">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2 py-0.5 rounded transition-colors ${
              mode === "upload"
                ? "bg-[#1E1E1C] text-white font-medium"
                : "text-[#6E6A62] hover:text-[#1E1E1C]"
            }`}
          >
            File Upload
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2 py-0.5 rounded transition-colors ${
              mode === "url"
                ? "bg-[#1E1E1C] text-white font-medium"
                : "text-[#6E6A62] hover:text-[#1E1E1C]"
            }`}
          >
            Direct URL
          </button>
        </div>
      </div>

      {mode === "upload" ? (
        <div>
          {value ? (
            /* Uploaded Preview State */
            <div className="relative border border-[#E5E0D7] bg-[#FAF7F2] rounded-xl p-3 flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#ECE6DC] shrink-0 border border-[#DDD5C8]">
                <img
                  src={value}
                  alt="Uploaded Artwork"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-medium text-[#15803D]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ready for Listing</span>
                </div>
                <p className="text-[11px] text-[#6E6A62] truncate font-mono">
                  {value}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#8C877E] bg-white px-2 py-0.5 rounded border border-[#E5E0D7]">
                    <Cloud className="w-3 h-3 text-[#C2410C]" />
                    <span>Cloud Storage</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] text-[#C2410C] hover:underline font-medium"
                  >
                    Replace Image
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 rounded-full hover:bg-[#EAE5DD] text-[#8C877E] hover:text-[#1E1E1C] transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Drag and Drop Upload Zone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-[#C2410C] bg-[#FFF8F3]"
                  : "border-[#D5CFC5] hover:border-[#1E1E1C] bg-[#FAF7F2]/50 hover:bg-[#FAF7F2]"
              } ${isUploading ? "pointer-events-none opacity-70" : ""}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {isUploading ? (
                <div className="py-4 space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#C2410C]" />
                  <p className="text-xs font-medium text-[#1E1E1C]">
                    Uploading artwork to Cloud Storage...
                  </p>
                  <p className="text-[11px] text-[#8C877E]">
                    Optimizing delivery & generating thumbnails
                  </p>
                </div>
              ) : (
                <div className="py-2 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#EAE5DD] mx-auto flex items-center justify-center text-[#1E1E1C]">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#1E1E1C]">
                      Click to upload artwork
                    </span>
                    <span className="text-xs text-[#8C877E]"> or drag and drop</span>
                  </div>
                  <p className="text-[10.5px] text-[#8C877E] max-w-xs mx-auto">
                    Supports high-resolution PNG, JPG, WEBP up to 10MB.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Direct URL Input Mode */
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://images.unsplash.com/... or https://res.cloudinary.com/..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#1E1E1C]"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="px-4 py-2 bg-[#1E1E1C] text-white text-xs font-semibold rounded-md hover:bg-[#383734] transition-colors"
            >
              Set
            </button>
          </div>
          {value && (
            <div className="flex items-center gap-2 text-[11px] text-[#15803D]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Current URL set: {value.slice(0, 40)}...</span>
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <div className="flex items-center gap-1.5 text-xs text-[#B91C1C] pt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      <p className="text-[11px] text-[#8C877E] leading-relaxed">
        {helperText}
      </p>
    </div>
  );
}
