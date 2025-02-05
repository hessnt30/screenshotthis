"use client";

import PreviewPost from "@/components/preview-post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";

export default function Challenge() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [finalWidth, setFinalWidth] = useState<number>(0);
  const [finalHeight, setFinalHeight] = useState<number>(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const originalWidth = img.width;
      const originalHeight = img.height;
      const originalRatio = originalWidth / originalHeight;

      // Define aspect ratios
      const ratio16_9 = 16 / 9;

      let newWidth, newHeight;

      if (Math.abs(originalRatio - ratio16_9) < 0.1) {
        // 📱 If close to 16:9, keep it
        newWidth = originalWidth;
        newHeight = originalWidth / ratio16_9;
      } else {
        // 🟩 Otherwise, make it a square
        const minSide = Math.min(originalWidth, originalHeight);
        newWidth = minSide;
        newHeight = minSide;
      }

      // Resize using canvas
      const canvas = document.createElement("canvas");
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Center crop if needed
      const offsetX = (originalWidth - newWidth) / 2;
      const offsetY = (originalHeight - newHeight) / 2;

      setFinalWidth(newWidth);
      setFinalHeight(newHeight);

      ctx.drawImage(
        img,
        offsetX,
        offsetY,
        newWidth,
        newHeight,
        0,
        0,
        newWidth,
        newHeight
      );
      canvas.toBlob((blob) => {
        if (blob) {
          setPreviewUrl(URL.createObjectURL(blob)); // Update preview with resized image
        }
      }, "image/jpeg");
    };
  };

  return (
    <div>
      <Input
        className="mb-4"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      {previewUrl && (
        <PreviewPost
          imageURL={previewUrl}
          width={finalWidth}
          height={finalHeight}
        />
      )}
      {previewUrl && (
        <div className="mt-4">
          <Label>Add a caption</Label>
          <Input type="text" placeholder="fun caption" />
          <div className="flex justify-end gap-2 mt-2">
            <Button variant={"secondary"}>Cancel</Button>

            <Button>Post</Button>
          </div>
        </div>
      )}
    </div>
  );
}
