import { useSearchParams } from "react-router";
import PropertyCard from "../components/items/PropertyCard";
import properties from "../properties.json";

const Listings = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const location = searchParams.get("location");

  console.log(type, location); // "apartment", "Hammam Sousse"
  console.log(properties);
  const filteredListings = properties.filter((property) => {
    return !location || property.location === location;
  });
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
    {
      id: 4,
      title: "Villa de luxe à Khezama",
      location: "Khezama",
      price: "1,200,000 TND",
      image:
        "https://images.unsplash.com/photo-1600585154205-7c1c1c1c1c1c?q=80&w=1600&auto=format&fit=crop",
      description:
        "Villa prestigieuse avec piscine privée, grand jardin et finitions haut de gamme.",
      bedrooms: 5,
      bathrooms: 4,
      area: 450, // m²
    },
    {
      id: 5,
      title: "Appartement cosy à Hammam Sousse",
      location: "Hammam Sousse",
      price: "180,000 TND",
      image:
        "https://images.unsplash.com/photo-1598928506311-1c1c1c1c1c1c?q=80&w=1600&auto=format&fit=crop",
      description:
        "Appartement chaleureux idéal pour jeunes couples, proche des écoles et commerces.",
      bedrooms: 2,
      bathrooms: 1,
      area: 95, // m²
    },
    {
      id: 6,
      title: "Maison traditionnelle à Médina de Sousse",
      location: "Médina de Sousse",
      price: "320,000 TND",
      image:
        "https://images.unsplash.com/photo-1580584128409-1c1c1c1c1c1c?q=80&w=1600&auto=format&fit=crop",
      description:
        "Maison au charme authentique avec patio intérieur et architecture traditionnelle.",
      bedrooms: 3,
      bathrooms: 2,
      area: 180, // m²
    },
    {
      id: 7,
      title: "Penthouse avec vue sur mer à Kantaoui",
      location: "Kantaoui",
      price: "850,000 TND",
      image:
        "https://images.unsplash.com/photo-1600585154235-1c1c1c1c1c1c?q=80&w=1600&auto=format&fit=crop",
      description:
        "Penthouse moderne avec terrasse panoramique et vue imprenable sur la mer.",
      bedrooms: 4,
      bathrooms: 3,
      area: 300, // m²
    },
    {
      id: 8,
      title: "Studio pratique à Sahloul",
      location: "Sahloul",
      price: "95,000 TND",
      image:
        "https://images.unsplash.com/photo-1600585154260-1c1c1c1c1c1c?q=80&w=1600&auto=format&fit=crop",
      description:
        "Studio fonctionnel parfait pour étudiants ou jeunes professionnels.",
      bedrooms: 1,
      bathrooms: 1,
      area: 45, // m²
    },
    {
      id: 9,
      title: "Maison de campagne à Akouda",
      location: "Akouda",
      price: "270,000 TND",
      image:
        "https://images.unsplash.com/photo-1600585154290-1c1c1c1c1c1c?q=80&w=1600&auto=format&fit=crop",
      description:
        "Maison paisible entourée de verdure, idéale pour les amoureux de la nature.",
      bedrooms: 3,
      bathrooms: 2,
      area: 200, // m²
    },
    {
      id: 10,
      title: "Appartement haut standing à Sousse Corniche",
      location: "Sousse Corniche",
      price: "600,000 TND",
      image:
        "https://images.unsplash.com/photo-1600585154320-1c1c1c1c1c1c?q=80&w=1600&auto=format&fit=crop",
      description:
        "Appartement moderne avec vue sur mer, matériaux de qualité et sécurité 24/7.",
      bedrooms: 3,
      bathrooms: 2,
      area: 160, // m²
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <p>
        {type} {location}
      </p>
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
            image={property.image}
            description={property.description}
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
