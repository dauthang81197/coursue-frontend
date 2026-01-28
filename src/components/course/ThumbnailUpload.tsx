"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { courseApi } from "@/lib/api/course";

interface ThumbnailUploadProps {
  courseId?: string;
  currentThumbnail?: string;
  onUploadSuccess?: (thumbnailUrl: string) => void;
  disabled?: boolean;
}

export const ThumbnailUpload: React.FC<ThumbnailUploadProps> = ({
  courseId,
  currentThumbnail,
  onUploadSuccess,
  disabled = false,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentThumbnail || null,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setError(null);

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload if courseId exists
    if (courseId) {
      await uploadThumbnail(file);
    }
  };

  const uploadThumbnail = async (file: File) => {
    if (!courseId) {
      setError("Course ID is required to upload thumbnail");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      const response = await courseApi.uploadThumbnail(
        courseId,
        file,
        (progress) => {
          setUploadProgress(progress);
        },
      );

      // Update preview with the actual URL from server
      setPreviewUrl(response.thumbnail);
      setSuccessMessage(response.message || "Thumbnail uploaded successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);

      // Pass the thumbnail URL to parent
      onUploadSuccess?.(response.thumbnail);
    } catch (err) {
      console.error("Failed to upload thumbnail:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload thumbnail";
      setError(errorMessage);
      setPreviewUrl(currentThumbnail || null);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Thumbnail
        </label>
        <p className="text-sm text-gray-500 mb-3">
          Upload a course thumbnail image (recommended: 16:9 ratio, max 5MB)
        </p>

        {/* Upload Area */}
        <div
          onClick={handleClick}
          className={`relative border-2 border-dashed rounded-lg overflow-hidden ${
            disabled
              ? "border-gray-200 bg-gray-50 cursor-not-allowed"
              : "border-gray-300 hover:border-primary-500 cursor-pointer"
          } ${previewUrl ? "aspect-video" : "aspect-video"}`}
        >
          {previewUrl ? (
            <>
              {/* Preview Image */}
              <div className="relative w-full h-full">
                <Image
                  src={previewUrl}
                  alt="Course thumbnail"
                  fill
                  className="object-cover"
                />

                {/* Overlay on hover */}
                {!disabled && !isUploading && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-center text-white">
                      <svg
                        className="w-12 h-12 mx-auto mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm font-medium">Click to change</p>
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 mx-auto mb-3">
                        <svg
                          className="animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      </div>
                      <p className="text-sm font-medium">
                        Uploading... {uploadProgress}%
                      </p>
                      <div className="w-48 mx-auto mt-2 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Remove Button */}
              {!disabled && !isUploading && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </>
          ) : (
            /* Upload Placeholder */
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm text-gray-600 mb-1">
                  Click to upload thumbnail
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
          className="hidden"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
          ✓ {successMessage}
        </div>
      )}

      {/* Info Message */}
      {!courseId && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
          ℹ️ Please create the course first before uploading a thumbnail
        </div>
      )}
    </div>
  );
};
