import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaBuilding,
  FaMapMarkerAlt,
  FaParking,
  FaRuler,
} from "react-icons/fa";
import { MdBathroom, MdBedroomParent } from "react-icons/md";
import { Link } from "react-router";
import EmblaCarousel from "./Embla/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import React from "react";
import { formatFloor, formatPrice, formatTitle } from "../../utils";
import { Property } from "../../types/Property";

const OPTIONS: EmblaOptionsType = { dragFree: false };

const Chip = ({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700">
    <span className="text-primary [&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>
    {children}
  </span>
);

const PropertyCard = ({
  _id,
  title,
  location,
  price,
  images,
  status,
  propertyType,
  area,
  bedrooms,
  bathrooms,
  floor,
  parking,
}: Property) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl"
    >
      <div className="relative overflow-hidden">
        <EmblaCarousel slides={images} options={OPTIONS} rounded={false} />
        {images.length === 0 && (
          <div className="aspect-4/3 w-full bg-gradient-to-br from-primary to-primary-hover" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
        <span className="absolute left-4 top-4 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary shadow-sm">
          {status === "sale" ? "À vendre" : status === "rent" ? "À louer" : "—"}
        </span>
        <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-sm font-bold text-primary shadow">
          {formatPrice(price)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 font-montserrat text-[17px] font-semibold leading-snug text-gray-900">
          {title}
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-500">
          <FaMapMarkerAlt aria-hidden className="shrink-0 text-primary" />
          <span className="min-w-0 truncate">{formatTitle(location)}</span>
        </p>

        <div className="mb-5 mt-4 flex flex-wrap gap-1.5">
          {bedrooms != null && bedrooms > 0 && (
            <Chip icon={<MdBedroomParent />}>{bedrooms} Ch.</Chip>
          )}
          {bathrooms != null && bathrooms > 0 && (
            <Chip icon={<MdBathroom />}>{bathrooms} SDB</Chip>
          )}
          {area != null && <Chip icon={<FaRuler />}>{area} m²</Chip>}
          {floor != null && (
            <Chip icon={<FaBuilding />}>{formatFloor(floor)}</Chip>
          )}
          {parking && <Chip icon={<FaParking />}>Parking</Chip>}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
          <span className="truncate text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            {propertyType}
          </span>
          <Link
            to={`/listings/${_id}`}
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary transition hover:text-primary-hover"
          >
            Voir le détail
            <FaArrowRight
              aria-hidden
              className="transition group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(PropertyCard);
