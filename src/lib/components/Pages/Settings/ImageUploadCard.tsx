"use client";

import React, { useState } from "react";
import { AuthImage } from "@/lib/services/Settings/settings_service";
import { Button } from "@/lib/ui/button";
import { Input } from "@/lib/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/ui/card";
import { Upload, Trash2, X } from "lucide-react";
import { ErrorResponse } from "@/lib/types/common";
import Image from "next/image";

interface ImageUploadCardProps {
  title: string;
  settingKey: string;
  currentImage: AuthImage | null;
  onUpload: (key: string, file: File, description?: string) => Promise<void>;
  onDelete: (key: string) => Promise<void>;
}

export const ImageUploadCard: React.FC<ImageUploadCardProps> = ({
  title,
  settingKey,
  currentImage,
  onUpload,
  onDelete,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file size (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      return;
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG");
      return;
    }

    setError(null);
    setFile(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      await onUpload(settingKey, file, description);
      setFile(null);
      setPreview(null);
      setDescription("");
    } catch (err: unknown) {
      const err_res = err as ErrorResponse;
      setError(err_res.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    setIsDeleting(true);
    setError(null);

    try {
      await onDelete(settingKey);
    } catch (err: unknown) {
      const err_res = err as ErrorResponse;
      setError(err_res.message || "Failed to delete image");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPreview(null);
    setDescription("");
    setError(null);
  };

  const backendHost =
    process.env.NEXT_PUBLIC_BACKEND_HOST || "http://localhost:8080";

  const displayImage = preview || backendHost + currentImage?.value;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image Preview */}
        {displayImage && (
          <div className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50">
            <Image
              src={displayImage}
              alt={title}
              fill
              className="object-contain"
            />
          </div>
        )}

        {/* Current Image Info */}
        {currentImage && !preview && (
          <div className="bg-gray-50 rounded-md p-3 space-y-1 text-sm">
            <p className="text-gray-700">
              {currentImage.description || "No description"}
            </p>
            {currentImage.updatedBy && (
              <p className="text-gray-500">
                Updated by: {currentImage.updatedBy.firstname}{" "}
                {currentImage.updatedBy.lastname}
              </p>
            )}
            <p className="text-gray-500">
              {new Date(currentImage.updatedAt).toLocaleString()}
            </p>
          </div>
        )}

        {/* File Input */}
        <div className="space-y-2">
          <label
            htmlFor={`file-${settingKey}`}
            className="block text-sm font-medium text-gray-700"
          >
            Select Image
          </label>
          <input
            id={`file-${settingKey}`}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
            onChange={handleFileChange}
            disabled={isUploading || isDeleting}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Description Input (shown when file is selected) */}
        {file && (
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Optional description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isUploading}
              label="Description"
              size="sm"
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {file ? (
            <>
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                size="sm"
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "Uploading..." : "Upload Image"}
              </Button>
              <Button
                onClick={handleCancel}
                disabled={isUploading}
                variant="outline"
                size="sm"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : currentImage ? (
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              variant="destructive"
              size="sm"
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete Image"}
            </Button>
          ) : (
            <p className="text-sm text-gray-500 italic">No image uploaded</p>
          )}
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-500">
          Max size: 5MB | Formats: JPEG, PNG, GIF, WebP, SVG
        </p>
      </CardContent>
    </Card>
  );
};
