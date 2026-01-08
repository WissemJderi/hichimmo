import { useParams } from "react-router";
import properties from "../properties.json";

// Icons
import { MdBathroom, MdBedroomParent } from "react-icons/md";
import { FaMapMarkerAlt, FaRuler } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import Breadcrumb from "../components/items/Breadcrumb";
import PropertyCard from "../components/items/PropertyCard";
import EmblaCarousel from "../components/items/Embla/EmblaCarousel";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { titleCase } from "../utils";

const PropertyDetailPage = () => {
  const [expanded, setExpanded] = useState(false);
  const maxChars = 300;
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const spanStyle =
    "flex flex-row gap-2 items-center bg-gray-200 py-2 px-4 rounded-md text-sm";
  const { id } = useParams();
  if (!id) {
    return <p>Property not found</p>;
  }
  const property = properties.find((p) => p.id === parseInt(id, 10));
  if (!property) {
    return <p>Property not found</p>;
  }

  const whatsappNumber = "21698622442";
  const message = `Je suis intéressé par le bien avec la référence ${property.id} (${property.title}). Est-il encore disponible ?`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  const breadcrumbItems = [
    { name: "Acceuil", href: "/" },
    { name: "Annonces", href: "/listings" },
    { name: property.title },
  ];
  const similarListings = useMemo(() => {
    return properties
      .filter(
        (prop) =>
          property.type?.toLowerCase() === prop.type?.toLowerCase() &&
          property.id !== prop.id,
      )
      .slice(0, 7);
  }, [property]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto py-12 px-6 font-lato"
    >
      <Breadcrumb items={breadcrumbItems} />
      <EmblaCarousel slides={property.images} rounded />
      <h1 className="mt-6 text-3xl font-bold font-montserrat">
        {property.title}
      </h1>
      <p className="flex flex-row gap-2 font-medium items-center mt-2 text-lg text-gray-700">
        <span>
          <FaMapMarkerAlt />
        </span>
        {titleCase(property.location)}
      </p>
      <p className="font-medium mt-4 mb-2">Description:</p>
      <p className="text-sm text-gray-600 whitespace-pre-line">
        {expanded
          ? property.longDescription
          : property.longDescription.slice(0, maxChars) +
            (property.longDescription.length > maxChars ? "..." : "")}
      </p>
      {property.longDescription.length > maxChars && (
        <button
          onClick={toggleExpanded}
          className="mt-1 text-primary cursor-pointer hover:underline hover:text-primary-hover text-sm"
        >
          {expanded ? "Voir moins" : "Voir plus"}
        </button>
      )}

      <div className="mt-6 flex gap-4 text-gray-800 flex-wrap">
        {property.bedrooms != null && property.bedrooms > 0 && (
          <span className={`${spanStyle}`}>
            <MdBedroomParent /> {property.bedrooms} chambre
            {property.bedrooms > 1 ? "s" : ""}
          </span>
        )}
        <span className={`${spanStyle}`}>
          <MdBathroom /> {property.bathrooms} salles de bain
        </span>
        <span className={`${spanStyle}`}>
          <FaRuler /> {property.area} m²
        </span>
      </div>
      <p className="mt-6 text-2xl font-semibold text-primary">
        {property.price}
      </p>
      <div className="mt-8">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-row items-center justify-center gap-2 rounded-md bg-green-500 px-6 py-3 text-white font-semibold shadow hover:bg-green-600 transition"
        >
          <IoLogoWhatsapp /> Contacter via WhatsApp
        </a>
      </div>
      <h2 className="text-center py-8 text-3xl font-bold tracking-tight font-montserrat text-gray-900 sm:text-4xl">
        Biens similaires
      </h2>
      {similarListings.length == 0 ? (
        <p className="text-center py-6 text-lg tracking-tight font-montserrat text-gray-900 sm:text-4xl">
          Aucun bien similaire n'a été trouvé
        </p>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 font-lato">
          {similarListings.map((listing) => {
            return <PropertyCard key={listing.id} {...listing} />;
          })}
        </div>
      )}
    </motion.div>
  );
};

export default PropertyDetailPage;
