import { Link } from "react-router";
import type { propertyCardProps } from "../../interfaces";
const PropertyCard = ({
  id,
  title,
  location,
  price,
  image,
}: propertyCardProps) => {
  return (
    <div
      key={id}
      className="overflow-hidden rounded-lg bg-white shadow hover:shadow-lg transition"
    >
      <img src={image} alt={title} className="h-48 w-full object-cover" />
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{location}</p>
        <p className="mt-2 text-gray-900 font-medium">{price}</p>
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
