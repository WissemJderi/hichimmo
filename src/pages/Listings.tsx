import { useSearchParams } from "react-router";
import PropertyCard from "../components/items/PropertyCard";
import properties from "../properties.json";

const Listings = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const location = searchParams.get("location");

  const filteredListings = properties.filter((property) => {
    return (
      (!type || property.type.toLowerCase() === type.toLowerCase()) &&
      (!location || property.location.toLowerCase() === location.toLowerCase())
    );
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="text-3xl font-bold tracking-tight font-montserrat text-gray-900 sm:text-4xl text-center">
        Découvrez Nos Propriétés
      </h2>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 font-lato">
        {filteredListings.map((property) => (
          <PropertyCard
            key={property.id}
            id={property.id}
            title={property.title}
            location={property.location}
            price={property.price}
            images={property.images}
            description={property.description}
            longDescription={property.longDescription}
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            area={property.area}
          />
        ))}
      </div>
    </div>
  );
};

export default Listings;
