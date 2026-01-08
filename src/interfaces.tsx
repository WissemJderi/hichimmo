export interface sideBarListItemProps {
  text: string;
  to: string;
  onClick: () => void;
}

export interface propertyCardProps {
  id: number;
  ref: string;
  title: string;
  location: string;
  price: string;
  images: string[];
  description: string;
  longDescription: string;
  bedrooms?: any;
  bathrooms?: number;
  floor?: number;
  parking?: boolean;
  area: any;
  type: string;
  status?: string;
  features?: string[];
  isFeatured?: boolean;
}

export interface BreadcrumbProps {
  items: { name: string; href?: string }[];
}
