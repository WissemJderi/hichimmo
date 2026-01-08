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
  // Area is optional (not all properties have it)
  bedrooms?: number;
  bathrooms?: number;
  area?: number; // optional, no null allowed
  type: string;
  status?: string;
  features?: string[];
  isFeatured?: boolean;
}

export interface BreadcrumbProps {
  items: { name: string; href?: string }[];
}
