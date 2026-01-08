import { motion } from "framer-motion";
import { Link } from "react-router";
import type { PropertyCardProps } from "../../interfaces"; // renamed for clarity
import { FaRuler } from "react-icons/fa";
import { MdBathroom, MdBedroomParent } from "react-icons/md";
import EmblaCarousel from "./Embla/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import React from "react";
import { titleCase } from "../../utils";

const OPTIONS: EmblaOptionsType = { dragFree: false };

const PropertyCard = ({
  id,
  title,
  location,
  price,
  images,
  description,
  bedrooms,
  bathrooms,
  area,
}: PropertyCardProps) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-lg bg-white shadow hover:shadow-lg transition flex flex-col justify-between"
    >
      <EmblaCarousel slides={images} options={OPTIONS} rounded={false} />

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {title}
        </h3>
        <p className="mt-2 text-sm text-gray-800">{titleCase(location)}</p>

        <p className="mt-2 text-sm text-gray-600 whitespace-pre-line line-clamp-3">
          {description}
        </p>

        {/* Features row - only show items that exist */}
        <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-700">
          {bedrooms != null && bedrooms > 0 && (
            <span className="flex items-center gap-2">
              <MdBedroomParent className="text-lg" />
              {bedrooms} Ch.
            </span>
          )}

          {bathrooms != null && bathrooms > 0 && (
            <span className="flex items-center gap-2">
              <MdBathroom className="text-lg" />
              {bathrooms} SDB
            </span>
          )}

          {area != null && (
            <span className="flex items-center gap-2">
              <FaRuler className="text-lg" />
              {area} m²
            </span>
          )}
        </div>

        <p className="mt-4 text-xl font-bold text-primary">{price}</p>

        <Link
          to={`/listings/${id}`}
          className="mt-6 block w-full rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-white hover:bg-primary-hover transition"
        >
          Voir le détail
        </Link>
      </div>
    </motion.div>
  );
};

export default React.memo(PropertyCard);
