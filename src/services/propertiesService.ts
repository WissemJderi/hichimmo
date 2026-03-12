import axios from "axios";
import { Location, Property, PropertyType } from "../types/Property";

const baseUrl = "/api/properties";

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

export default { getAll, getPropertyById, searchProperties };
