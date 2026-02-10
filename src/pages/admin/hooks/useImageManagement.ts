import { useState } from "react";

export const MAX_IMAGES = 5; // or import from constants

export const useImageManagement = (initialImages: string[] = []) => {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(initialImages);
  const [imageError, setImageError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageError("");

    // Check if total images exceed limit
    if (files.length > MAX_IMAGES) {
      setImageError(
        `Vous ne pouvez télécharger que ${MAX_IMAGES} images maximum.`,
      );
      e.target.value = "";
      return;
    }

    if (imagePreviews.length + files.length > MAX_IMAGES) {
      setImageError(
        `Vous ne pouvez avoir que ${MAX_IMAGES} images maximum au total.`,
      );
      e.target.value = "";
      return;
    }

    setImages((prev) => [...prev, ...files]);

    // Create previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    e.target.value = "";
  };

  const removeImage = (index: number, existingImagesCount: number = 0) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));

    // Remove from files (if it's a newly added file)
    if (index >= existingImagesCount) {
      const fileIndex = index - existingImagesCount;
      setImages((prev) => prev.filter((_, i) => i !== fileIndex));
    }

    setImageError("");
  };

  const canAddMoreImages = imagePreviews.length < MAX_IMAGES;

  return {
    images,
    imagePreviews,
    imageError,
    handleImageChange,
    removeImage,
    canAddMoreImages,
    setImageError,
  };
};
