import { useSearchParams } from "react-router";
import PropertyCard from "../components/items/PropertyCard";
import properties from "../properties.json";
import { useMemo } from "react";

const Listings = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const location = searchParams.get("location");

  const filteredListings = useMemo(() => {
    return properties.filter((property) => {
      const propertyType = property.type?.toLowerCase() || "";
      const propertyLocation = property.location?.toLowerCase() || "";
      return (
        (!type || propertyType === type.toLowerCase()) &&
        (!location || propertyLocation === location.toLowerCase())
      );
    });
  }, [type, location]);
  return (
    <div
      className="mx-auto max-w-7xl px-6 py-16"
      aria-labelledby="listings-heading"
    >
      <h2
        id="listings-heading"
        className="text-3xl font-bold tracking-tight font-montserrat text-gray-900 sm:text-4xl text-center"
      >
        Découvrez Nos Propriétés
      </h2>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 font-lato">
        {filteredListings.length > 0 ? (
          filteredListings.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))
        ) : (
          <p className="text-center text-gray-600 mt-6">
            Aucun bien ne correspond à votre recherche.
          </p>
        )}
      </div>
    </div>
  );
};

export default Listings;
