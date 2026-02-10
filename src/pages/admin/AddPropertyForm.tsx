import { useState } from "react";
import { Property, PropertyType, Location } from "../../types/Property";
import { formatTitle, titleCase } from "../../utils";
import propertiesService from "../../services/propertiesService";
import { useNavigate } from "react-router";

interface PropertyFormProps {
  property?: Property;
  onCancel: () => void;
}

const PropertyForm = ({ property, onCancel }: PropertyFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: property?.title || "",
    ref: property?.ref || "",
    description: property?.description || "",
    price: property?.price || 0,
    propertyType: property?.propertyType || ("appartement" as PropertyType),
    location: property?.location || ("akouda" as Location),
    area: property?.area || 0,
    status: property?.status || ("sale" as "sale" | "rent"),
    floor: property?.floor || undefined,
    parking: property?.parking || false,
    bedrooms: property?.bedrooms || undefined,
    bathrooms: property?.bathrooms || undefined,
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    property?.images || [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState("");

  const MAX_IMAGES = 5;

  const locations = Object.values(Location);
  const propertyTypes = Object.values(PropertyType);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageError("");

    // Check if total images exceed limit
    if (files.length > MAX_IMAGES) {
      setImageError(
        `Vous ne pouvez télécharger que ${MAX_IMAGES} images maximum.`,
      );
      e.target.value = ""; // Reset input
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

    e.target.value = ""; // Reset input to allow re-selecting
  };

  const removeImage = (index: number) => {
    // Remove from previews
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));

    // Remove from files (if it's a newly added file)
    const existingImagesCount = property?.images?.length || 0;
    if (index >= existingImagesCount) {
      const fileIndex = index - existingImagesCount;
      setImages((prev) => prev.filter((_, i) => i !== fileIndex));
    }

    setImageError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate images
    if (imagePreviews.length === 0) {
      setImageError("Veuillez ajouter au moins une image.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("ref", formData.ref);
      data.append("description", formData.description);
      data.append("price", String(formData.price));
      data.append("propertyType", formData.propertyType);
      data.append("location", formData.location);
      data.append("area", String(formData.area));
      data.append("status", formData.status);

      if (formData.bedrooms) data.append("bedrooms", String(formData.bedrooms));
      if (formData.bathrooms)
        data.append("bathrooms", String(formData.bathrooms));
      if (formData.floor) data.append("floor", String(formData.floor));
      data.append("parking", String(formData.parking));

      images.forEach((image) => {
        data.append("images", image);
      });

      console.log(data);

      await propertiesService.addProperty(data);

      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  const canAddMoreImages = imagePreviews.length < MAX_IMAGES;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto"
      encType="multipart/form-data"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {property ? "Modifier la propriété" : "Ajouter une propriété"}
      </h2>

      <div className="space-y-6">
        {/* Titre */}
        <div>
          <label htmlFor="title" className={labelClass}>
            Titre *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        {/* Référence */}
        <div>
          <label htmlFor="ref" className={labelClass}>
            Référence *
          </label>
          <input
            type="text"
            id="ref"
            name="ref"
            value={formData.ref}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className={labelClass}>
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={inputClass}
            required
          />
        </div>

        {/* Prix et Superficie */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className={labelClass}>
              Prix (DT) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={inputClass}
              min="0"
              required
            />
          </div>

          <div>
            <label htmlFor="area" className={labelClass}>
              Superficie (m²) *
            </label>
            <input
              type="number"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              className={inputClass}
              min="0"
              required
            />
          </div>
        </div>

        {/* Type de propriété et Localisation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="propertyType" className={labelClass}>
              Type de propriété *
            </label>
            <select
              id="propertyType"
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className={inputClass}
              required
            >
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {titleCase(type)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="location" className={labelClass}>
              Localisation *
            </label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={inputClass}
              required
            >
              {locations.map((location) => (
                <option value={location} key={location}>
                  {formatTitle(location)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Statut */}
        <div>
          <label htmlFor="status" className={labelClass}>
            Statut *
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="sale">Vente</option>
            <option value="rent">Location</option>
          </select>
        </div>

        {/* Optional fields */}
        {(formData.propertyType === "appartement" ||
          formData.propertyType === "maison" ||
          formData.propertyType === "villa") && (
          <>
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Détails supplémentaires
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="bedrooms" className={labelClass}>
                    Chambres
                  </label>
                  <input
                    type="number"
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms || ""}
                    onChange={handleChange}
                    className={inputClass}
                    min="0"
                  />
                </div>

                <div>
                  <label htmlFor="bathrooms" className={labelClass}>
                    Salles de bain
                  </label>
                  <input
                    type="number"
                    id="bathrooms"
                    name="bathrooms"
                    value={formData.bathrooms || ""}
                    onChange={handleChange}
                    className={inputClass}
                    min="0"
                  />
                </div>

                <div>
                  <label htmlFor="floor" className={labelClass}>
                    Étage
                  </label>
                  <input
                    type="number"
                    id="floor"
                    name="floor"
                    value={formData.floor || ""}
                    onChange={handleChange}
                    className={inputClass}
                    min="0"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="parking"
                    checked={formData.parking}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Parking disponible
                  </span>
                </label>
              </div>
            </div>
          </>
        )}

        {/* Images */}
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

          {imageError && (
            <p className="mt-2 text-sm text-red-600">{imageError}</p>
          )}

          {!canAddMoreImages && (
            <p className="mt-2 text-sm text-amber-600">
              Limite de {MAX_IMAGES} images atteinte
            </p>
          )}

          {/* Image Previews with Remove Button */}
          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-full object-cover rounded border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    title="Supprimer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {isSubmitting
            ? "Enregistrement..."
            : property
              ? "Modifier"
              : "Ajouter"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 font-medium transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;
