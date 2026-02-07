import PropertyCard from "../components/items/PropertyCard";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Location, Property, PropertyType } from "../types/Property";
import propertiesService from "../services/propertiesService";
import { useSearchParams } from "react-router";

const Listings = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const location = searchParams.get("location");

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getProperties = async () => {
      try {
        if (location && type) {
          const fetchedProperties = await propertiesService.searchProperties(
            (location as Location) || "none",
            type as PropertyType,
          );

          setProperties(
            Array.isArray(fetchedProperties)
              ? fetchedProperties
              : fetchedProperties
                ? [fetchedProperties]
                : [],
          );
        } else {
          const fetchedProperties = await propertiesService.getAll();
          setProperties(fetchedProperties);
        }
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    };
    getProperties();
  }, [location, type]);

  if (loading)
    return <p className="text-center text-lg">Chargement des propriétés...</p>;

  if (properties.length === 0)
    return <p className="text-center text-lg">Aucune propriété trouvée.</p>;

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
        {properties.map((property) => (
          <PropertyCard
            key={`${property.title} ${property._id}`}
            {...property}
            area={property.area ?? undefined}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Listings;
