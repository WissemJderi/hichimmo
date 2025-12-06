export interface sideBarListItemProps {
  text: string;
  to: string;
  onClick: () => void;
}

export interface propertyCardProps {
  id: number;
  title: string;
  location: string;
  price: string;
  image: string;
  description?: string;
  longDescription?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  type?: string;
  status?: "sale" | "rent" | "sold";
  features?: string[];
  agent?: string;
  contactLink?: string;
  dateListed?: string;
  isFeatured?: boolean;
  gallery?: string[];
}

export interface BreadcrumbProps {
  items: { name: string; href?: string }[];
}
