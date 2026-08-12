import PropertyCard from "../components/items/PropertyCard";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Location, Property, PropertyType } from "../types/Property";
import propertiesService from "../services/propertiesService";
import { useSearchParams } from "react-router";

const PAGE_SIZE = 9;

const Listings = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const location = searchParams.get("location");

  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const fetchPage = useCallback(async (pageNum: number, append: boolean) => {
    try {
      const shouldFilter = Boolean(location && type);
      const result = shouldFilter
        ? await propertiesService.searchPaginated(
            location as Location,
            type as PropertyType,
            pageNum,
            PAGE_SIZE,
          )
        : await propertiesService.getPaginated(pageNum, PAGE_SIZE);

      setProperties((prev) =>
        append ? [...prev, ...result.properties] : result.properties,
      );
      setTotal(result.total);
      setPage(pageNum);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [location, type]);

  useEffect(() => {
    setLoading(true);
    setProperties([]);
    setTotal(0);
    fetchPage(1, false);
  }, [location, type, fetchPage]);

  if (loading)
    return <p className="text-center text-lg">Chargement des propriétés...</p>;

  if (properties.length === 0)
    return <p className="text-center text-lg">Aucune propriété trouvée.</p>;

  const hasMore = properties.length < total;

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

      {hasMore && (
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              setLoadingMore(true);
              fetchPage(page + 1, true);
            }}
            disabled={loadingMore}
            className="inline-block rounded-md bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60"
          >
            {loadingMore ? "Chargement..." : "Charger plus"}
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default Listings;