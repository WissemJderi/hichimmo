export interface sideBarListItemProps {
  text: string;
  to: string;
  onClick: () => void;
}

export interface PropertyCardProps {
  id: number;
  ref: string;
  title: string;
  location: string;
  price: string;
  images: string[];
  description: string;
  longDescription: string;

  // These are optional — only present on apartments/houses
  floor?: number;
  parking?: boolean;

  // Area can be number or null (e.g. price per m² only)
  // These are optional — only apartments have them
  bedrooms?: number;
  bathrooms?: number;
  area?: number | null; // can be missing or null

  type: string;
  status?: string;
  features?: string[];
  isFeatured?: boolean;
}

export interface BreadcrumbProps {
  items: { name: string; href?: string }[];
}
