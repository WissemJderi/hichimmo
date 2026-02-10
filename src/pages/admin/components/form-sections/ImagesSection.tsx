import { labelClass, inputClass, MAX_IMAGES } from "../../../../../constants/formConstants";
import ImagePreviw from "../ImagePreviw";

interface ImagesSectionProps {
  imagePreviews: string[];
  imageError: string;
  canAddMoreImages: boolean;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
}

const ImagesSection = ({
  imagePreviews,
  imageError,
  canAddMoreImages,
  handleImageChange,
  removeImage,
}: ImagesSectionProps) => (
  <div>
    <label className={labelClass}>
      Images * ({imagePreviews.length}/{MAX_IMAGES})
    </label>

    {canAddMoreImages && (
      <input
        type="file"
        id="images"
        name="images"
        onChange={handleImageChange}
        accept="image/*"
        multiple
        className={`${inputClass} cursor-pointer`}
      />
    )}

    {imageError && <p className="mt-2 text-sm text-red-600">{imageError}</p>}

    {!canAddMoreImages && (
      <p className="mt-2 text-sm text-amber-600">
        Limite de {MAX_IMAGES} images atteinte
      </p>
    )}

    {imagePreviews.length > 0 && (
      <ImagePreviw
        imagePreviews={imagePreviews}
        removeImage={removeImage}
      />
    )}
  </div>
);

export default ImagesSection;
