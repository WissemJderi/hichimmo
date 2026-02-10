import { FormDataState } from "./usePropertyForm";

export interface ValidationError {
  field: string;
  message: string;
}

export const validatePropertyForm = (
  formData: FormDataState,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Required fields validation
  if (!formData.title?.trim()) {
    errors.push({ field: "title", message: "Le titre est obligatoire" });
  }

  if (!formData.ref?.trim()) {
    errors.push({ field: "ref", message: "La référence est obligatoire" });
  }

  if (!formData.description?.trim()) {
    errors.push({
      field: "description",
      message: "La description est obligatoire",
    });
  }

  if (!formData.propertyType) {
    errors.push({
      field: "propertyType",
      message: "Le type de propriété est obligatoire",
    });
  }

  if (!formData.location) {
    errors.push({
      field: "location",
      message: "La localisation est obligatoire",
    });
  }

  if (!formData.status) {
    errors.push({
      field: "status",
      message: "Le statut est obligatoire",
    });
  }

  // Price validation
  if (formData.price === undefined || formData.price === null) {
    errors.push({ field: "price", message: "Le prix est obligatoire" });
  } else if (formData.price <= 0) {
    errors.push({
      field: "price",
      message: "Le prix doit être un nombre positif",
    });
  } else if (!Number.isFinite(formData.price)) {
    errors.push({
      field: "price",
      message: "Le prix doit être un nombre valide",
    });
  }

  // Area validation
  if (formData.area === undefined || formData.area === null) {
    errors.push({ field: "area", message: "La superficie est obligatoire" });
  } else if (formData.area <= 0) {
    errors.push({
      field: "area",
      message: "La superficie doit être un nombre positif",
    });
  } else if (!Number.isFinite(formData.area)) {
    errors.push({
      field: "area",
      message: "La superficie doit être un nombre valide",
    });
  }

  // Bedrooms validation (if present)
  if (formData.bedrooms !== undefined && formData.bedrooms !== null) {
    if (formData.bedrooms < 0) {
      errors.push({
        field: "bedrooms",
        message: "Le nombre de chambres doit être un nombre entier positif",
      });
    } else if (!Number.isInteger(formData.bedrooms)) {
      errors.push({
        field: "bedrooms",
        message:
          "Le nombre de chambres doit être un nombre entier (pas de décimal)",
      });
    }
  }

  // Bathrooms validation (if present)
  if (formData.bathrooms !== undefined && formData.bathrooms !== null) {
    if (formData.bathrooms < 0) {
      errors.push({
        field: "bathrooms",
        message: "Le nombre de salles de bain doit être un nombre entier positif",
      });
    } else if (!Number.isInteger(formData.bathrooms)) {
      errors.push({
        field: "bathrooms",
        message:
          "Le nombre de salles de bain doit être un nombre entier (pas de décimal)",
      });
    }
  }

  // Floor validation (if present)
  if (formData.floor !== undefined && formData.floor !== null) {
    if (formData.floor < 0) {
      errors.push({
        field: "floor",
        message: "L'étage doit être un nombre positif",
      });
    } else if (!Number.isInteger(formData.floor)) {
      errors.push({
        field: "floor",
        message: "L'étage doit être un nombre entier (pas de décimal)",
      });
    }
  }

  return errors;
};

export const isFormValid = (formData: FormDataState): boolean => {
  return validatePropertyForm(formData).length === 0;
};
