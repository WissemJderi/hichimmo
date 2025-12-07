import { Link } from "react-router";
import PropertyCard from "./items/PropertyCard";
import properties from "../properties.json";
const FeaturedListings = () => {
  const featuredProperties = properties.slice(0, 3);

  return (
    <div>
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
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                location={property.location}
                price={property.price}
                images={property.images}
                description={property.description}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                area={property.area}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/listings"
              className="inline-block rounded-md bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover"
            >
              Voir tous les biens
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturedListings;
