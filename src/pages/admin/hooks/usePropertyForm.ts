import { useState } from "react";
import { Property, PropertyType, Location } from "../../../types/Property";

export interface FormDataState {
  title: string;
  ref: string;
  description: string;
  price: number;
  propertyType: PropertyType;
  location: Location;
  area: number;
  status: "sale" | "rent";
  floor?: number;
  parking: boolean;
  bedrooms?: number;
  bathrooms?: number;
}

export const usePropertyForm = (property?: Property) => {
  const [formData, setFormData] = useState<FormDataState>({
    title: property?.title || "",
    ref: property?.ref || "",
    description: property?.description || "",
    price: property?.price || 0,
    propertyType: property?.propertyType || ("appartement" as PropertyType),
    location: property?.location || ("akouda" as Location),
    area: property?.area || 0,
    status: property?.status || ("sale" as "sale" | "rent"),
    floor: property?.floor,
    parking: property?.parking || false,
    bedrooms: property?.bedrooms,
    bathrooms: property?.bathrooms,
  });

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

  const resetForm = () => {
    setFormData({
      title: property?.title || "",
      ref: property?.ref || "",
      description: property?.description || "",
      price: property?.price || 0,
      propertyType: property?.propertyType || ("appartement" as PropertyType),
      location: property?.location || ("akouda" as Location),
      area: property?.area || 0,
      status: property?.status || ("sale" as "sale" | "rent"),
      floor: property?.floor,
      parking: property?.parking || false,
      bedrooms: property?.bedrooms,
      bathrooms: property?.bathrooms,
    });
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleCheckboxChange,
    resetForm,
  };
};
