export type Status = "sale" | "rent";

export enum PropertyType {
  Appartement = "appartement",
  Bureau = "bureau",
  Depot = "depot",
  Local = "local",
  Maison = "maison",
  Terrain = "terrain",
  Villa = "villa",
  Usine = "usine",
}

export enum Location {
  Akouda = "akouda",
  HammamSousse = "hammam_sousse",
  ChattMariem = "chatt_mariem",
  Hergla = "hergla",
  KalaaSghira = "kalaa_sghira",
  KalaaKebira = "kalaa_kebira",
  Kantaoui = "kantaoui",
  Khzema = "khzema",
  Sousse = "sousse",
  SidiAbdelhamid = "sidi_abdelhamid",
  SidiBouAli = "sidi_bouali",
  ZaouietSousse = "zaouiet_sousse",
}

export interface Property {
  _id: string;
  title: string;
  ref: string;
  description: string;
  price: number;
  propertyType: PropertyType;
  location: Location;
  area: number;
  status: "sale" | "rent";
  images: string[];
  // These are optional — only present on apartments/houses
  floor?: number;
  parking?: boolean;
  bedrooms?: number;
  bathrooms?: number;
  createdAt: string;
}
