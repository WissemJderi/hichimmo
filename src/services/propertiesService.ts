import axios from "axios";
import { Location, Property, PropertyType } from "../types/Property";
import { API_URL } from "./config";

const baseUrl = `${API_URL}/properties`;

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
  const params: Record<string, string> = {};
  if (location && location !== "none") params.location = location;
  if (type && type !== "none") params.type = type;

  const properties = await axios.get<Property[]>(`${baseUrl}/search`, {
    params,
  });
  return properties.data;
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
  getAll,
  getPropertyById,
  searchProperties,
  addProperty,
  removeProperty,
  updateProperty,
};
