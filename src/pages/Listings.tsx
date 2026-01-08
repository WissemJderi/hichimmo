import { useSearchParams } from "react-router";
import PropertyCard from "../components/items/PropertyCard";
import properties from "../properties.json";
import { useMemo } from "react";
import { motion } from "framer-motion";

const Listings = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const location = searchParams.get("location");

  const filteredListings = useMemo(() => {
    return properties.filter((property) => {
      const propertyType = property.type?.toLowerCase();
      const propertyLocation = property.location?.toLowerCase();

      const typeFilter =
        !type || type === "all" || propertyType === type.toLowerCase();

      const locationFilter =
        !location ||
        location === "Voir tout" ||
        propertyLocation === location.toLowerCase();

      return typeFilter && locationFilter;
    });
  }, [type, location]);

  return (
    <motion.div
      className="mx-auto max-w-7xl px-6 py-16"
      aria-labelledby="listings-heading"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        id="listings-heading"
        className="text-3xl font-bold tracking-tight font-montserrat text-gray-900 sm:text-4xl text-center"
      >
        Découvrez Nos Propriétés
      </motion.h2>

      <motion.div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 font-lato">
        {filteredListings.length > 0 ? (
          filteredListings.map((property) => (
            <PropertyCard
              key={`${property.title} ${property.id}`}
              {...property}
              area={property.area ?? undefined}
            />
          ))
        ) : (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-gray-600 mt-6"
          >
            Aucun bien ne correspond à votre recherche.
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Listings;
