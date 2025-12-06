import { Link } from "react-router";
import type { propertyCardProps } from "../../interfaces";
import { FaRuler } from "react-icons/fa";
import { MdBathroom, MdBedroomParent } from "react-icons/md";
import EmblaCarousel from "./Embla/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";

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
  const OPTIONS: EmblaOptionsType = { dragFree: false };
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow hover:shadow-lg transition flex flex-col justify-between">
      {/* <img src={image} alt={title} className="h-48 w-full object-cover" /> */}

      <EmblaCarousel slides={images} options={OPTIONS} />
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-800">{location}</p>
        <p className="mt-2 text-sm text-gray-600">{description}</p>

        <div className="mt-3 flex gap-6 text-sm text-gray-700">
          <span className="flex flex-row gap-2 items-center">
            <MdBedroomParent /> {bedrooms} m²
          </span>
          <span className="flex flex-row gap-2 items-center">
            <MdBathroom /> {bathrooms} m²
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
    </div>
  );
};

export default PropertyCard;
