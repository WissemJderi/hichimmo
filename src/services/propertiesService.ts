import axios from "axios";
import { Location, Property, PropertyType } from "../types/Property";
import { API_URL } from "./config";

const baseUrl = `${API_URL}/properties`;

export type PaginatedProperties = { properties: Property[]; total: number };

const getPaginated = async (
  page = 1,
  limit = 16,
): Promise<PaginatedProperties> => {
  const response = await axios.get<Property[]>(baseUrl, {
    params: { page, limit },
  });
  return {
    properties: response.data,
    total: Number(response.headers["x-total-count"]) || response.data.length,
  };
};

const getAll = async () => {
  const data = await axios.get<Property[]>(baseUrl);
  return data.data;
};

const getPropertyById = async (id: string) => {
  const fetchProperty = await axios.get<Property>(`${baseUrl}/${id}`);
  return fetchProperty.data;
};

const searchProperties = async (
  location?: Location | "none",
  type?: PropertyType | "none",
) => {
  const properties = await searchPaginated(location, type);
  return properties.properties;
};

const searchPaginated = async (
  location?: Location | "none",
  type?: PropertyType | "none",
  page = 1,
  limit = 16,
): Promise<PaginatedProperties> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };
  if (location && location !== "none") params.location = location;
  if (type && type !== "none") params.type = type;

  const properties = await axios.get<Property[]>(`${baseUrl}/search`, {
    params,
  });
  return {
    properties: properties.data,
    total: Number(properties.headers["x-total-count"]) || properties.data.length,
  };
};

const addProperty = async (data: FormData) => {
  const token = localStorage.getItem("webtoken");
  if (!token) {
    throw new Error("Token is invalid");
  }

  const parsedToken = JSON.parse(token);

  const property = await axios.post(baseUrl, data, {
    headers: { Authorization: `Bearer ${parsedToken}` },
  });

  return property.data;
};

const removeProperty = async (id: string) => {
  const token = localStorage.getItem("webtoken");
  if (!token) {
    throw new Error("Token is invalid");
  }

  const parsedToken = JSON.parse(token);

  const property = await axios.delete(`${baseUrl}/${id}`, {
    headers: { Authorization: `Bearer ${parsedToken}` },
  });

  return property.data;
};

const updateProperty = async (id: string, data: FormData) => {
  const token = localStorage.getItem("webtoken");
  if (!token) throw new Error("Token is invalid");
  const parsedToken = JSON.parse(token);
  const property = await axios.put(`${baseUrl}/${id}`, data, {
    headers: { Authorization: `Bearer ${parsedToken}` },
  });
  return property.data;
};

export default {
  getPaginated,
  getAll,
  getPropertyById,
  searchProperties,
  searchPaginated,
  addProperty,
  removeProperty,
  updateProperty,
};
