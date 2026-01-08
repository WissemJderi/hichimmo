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
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  parking?: boolean;

  // Area can be number or null (e.g. price per m² only)
  area?: number | null;

  type: string;
  status?: string;
  features?: string[];
  isFeatured?: boolean;
}

export interface BreadcrumbProps {
  items: { name: string; href?: string }[];
}
