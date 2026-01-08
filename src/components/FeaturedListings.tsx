import { Link } from "react-router";
import { motion } from "framer-motion";
import PropertyCard from "./items/PropertyCard";
import properties from "../properties.json";
import { useMemo } from "react";

const FeaturedListings = () => {
  const featuredProperties = useMemo(() => properties.slice(0, 3), []);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-gray-50 py-16"
    >
      <div className="mx-auto max-w-7xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-bold tracking-tight font-montserrat text-gray-900 sm:text-4xl"
        >
          Biens en vedette
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="mt-2 text-lg text-gray-600 font-lato"
        >
          Découvrez nos meilleures opportunités immobilières.
        </motion.p>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 font-lato"
        >
          {featuredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              {...property}
              area={property.area ?? undefined}
            />
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Link
            to="/listings"
            aria-label="Voir tous les biens immobiliers"
            className="inline-block rounded-md bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover"
          >
            Voir tous les biens
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeaturedListings;
