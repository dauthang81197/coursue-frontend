"use client";

import { useState, useRef } from "react";
import { lessonApi } from "@/lib/api/lesson";
import { Button } from "@/components/base/Button";

interface VideoUploadProps {
  lessonId: string;
  onSuccess: () => void;
}

export function VideoUpload({ lessonId, onSuccess }: VideoUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.startsWith("video/")) {
      setError("Please select a video file");
      return;
    }

    // Validate file size (max 500MB)
    const maxSize = 500 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError("File size must be less than 500MB");
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setError(null);
      setProgress(0);

      await lessonApi.uploadVideo(lessonId, file, (progressPercent) => {
        setProgress(progressPercent);
      });

      // Get video URL after upload
      const url = await lessonApi.getVideoUrl(lessonId);
      setVideoUrl(url);

      onSuccess();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload video";
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handlePreview = async () => {
    try {
      const url = await lessonApi.getVideoUrl(lessonId);
      setVideoUrl(url);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get video URL";
      setError(errorMessage);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Upload Video</h4>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* File Input */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition-colors text-center"
          disabled={uploading}
        >
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            {file ? file.name : "Click to select video file"}
          </p>
          {file && (
            <p className="mt-1 text-xs text-gray-500">
              {formatFileSize(file.size)} • {file.type}
            </p>
          )}
        </button>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-3">
        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="flex-1"
        >
          {uploading ? "Uploading..." : "Upload Video"}
        </Button>

        <Button variant="outline" onClick={handlePreview} disabled={uploading}>
          Preview Existing
        </Button>
      </div>

      {/* Video Preview */}
      {videoUrl && (
        <div className="mt-4">
          <video
            src={videoUrl}
            controls
            className="w-full rounded-lg"
            style={{ maxHeight: "400px" }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}
