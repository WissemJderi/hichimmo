import { Link } from "react-router";
import PropertyCard from "./items/PropertyCard";
import properties from "../properties.json";
import { useMemo } from "react";
const FeaturedListings = () => {
  const featuredProperties = useMemo(() => properties.slice(0, 3), []);

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-bold tracking-tight font-montserrat text-gray-900 sm:text-4xl">
          Biens en vedette
        </h2>
        <p className="mt-2 text-lg text-gray-600 font-lato">
          Découvrez nos meilleures opportunités immobilières.
        </p>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 font-lato">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/listings"
            aria-label="Voir tous les biens immobiliers"
            className="inline-block rounded-md bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover"
          >
            Voir tous les biens
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
