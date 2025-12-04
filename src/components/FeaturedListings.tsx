import { Link } from "react-router";
import PropertyCard from "./items/PropertyCard";

const FeaturedListings = () => {
  const featuredProperties = [
    {
      id: 1,
      title: "Appartement moderne à Sahloul",
      location: "Sahloul",
      price: "250,000 TND",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
      description:
        "Appartement lumineux avec balcon, proche des commodités et du centre-ville.",
      bedrooms: 3,
      bathrooms: 2,
      area: 120, // m²
    },
    {
      id: 2,
      title: "Maison familiale à Hammam Sousse",
      location: "Hammam Sousse",
      price: "480,000 TND",
      image:
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1600&auto=format&fit=crop",
      description:
        "Maison spacieuse avec jardin et garage, idéale pour une famille.",
      bedrooms: 4,
      bathrooms: 3,
      area: 250, // m²
    },
    {
      id: 3,
      title: "Bureau spacieux à Kantaoui",
      location: "Kantaoui",
      price: "1,200 TND / mois",
      image:
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop",
      description:
        "Bureau moderne situé au cœur de Kantaoui, parfait pour une équipe professionnelle.",
      bedrooms: 0, // not applicable
      bathrooms: 1,
      area: 80, // m²
    },
  ];
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
                image={property.image}
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
