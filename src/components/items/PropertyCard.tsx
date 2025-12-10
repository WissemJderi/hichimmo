import { motion } from "framer-motion";
import { Link } from "react-router";
import type { propertyCardProps } from "../../interfaces";
import { FaRuler } from "react-icons/fa";
import { MdBathroom, MdBedroomParent } from "react-icons/md";
import EmblaCarousel from "./Embla/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import React from "react";

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
}: propertyCardProps) => {
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
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-800">
          {location.charAt(0).toUpperCase() + location.slice(1)}
        </p>
        <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">
          {description}
        </p>

        <div className="mt-3 flex gap-6 text-sm text-gray-700">
          <span className="flex flex-row gap-2 items-center">
            <MdBedroomParent /> {bedrooms} Ch.
          </span>
          <span className="flex flex-row gap-2 items-center">
            <MdBathroom /> {bathrooms} SDB
          </span>
          <span className="flex flex-row gap-2 items-center">
            <FaRuler /> {area} m²
          </span>
        </div>

        <p className="mt-2 text-primary font-bold">{price}</p>
        <Link
          to={`/listings/${id}`}
          className="mt-4 block w-full rounded-md bg-primary px-4 py-2 text-sm text-center font-medium text-white hover:bg-primary-hover"
        >
          Voir le détail
        </Link>
      </div>
    </motion.div>
  );
};

export default React.memo(PropertyCard);
