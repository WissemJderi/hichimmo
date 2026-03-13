import axios from "axios";
import { Location, Property, PropertyType } from "../types/Property";

const baseUrl = "/api/properties";
const adminUrl = "https://dahechimmo-backend.onrender.com/api/properties";

const getAll = async () => {
  const data = await axios.get<Property[]>(baseUrl);
  return data.data;
};

const getPropertyById = async (id: string) => {
  const fetchProperty = await axios.get<Property>(`${baseUrl}?id=${id}`);
  return fetchProperty.data;
};

const searchProperties = async (
  location: Location | "none",
  type: PropertyType,
) => {
  const properties = await axios.get<Property[]>(
    `${baseUrl}?location=${location}&type=${type}`,
  );
  return properties.data;
};
const addProperty = async (data: FormData) => {
  const token = localStorage.getItem("webtoken");
  if (!token) {
    throw new Error("Token is invalid");
  }

  const parsedToken = JSON.parse(token);

  const property = await axios.post(adminUrl, data, {
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

  const property = await axios.delete(`${adminUrl}/${id}`, {
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
};
