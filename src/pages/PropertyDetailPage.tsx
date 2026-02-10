import { useParams } from "react-router";

// Icons
import { FaBuilding, FaMapMarkerAlt, FaParking, FaRuler } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import Breadcrumb from "../components/items/Breadcrumb";
import EmblaCarousel from "../components/items/Embla/EmblaCarousel";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Property } from "../types/Property";
import {
  createWhatsappUrl,
  formatFloor,
  formatPrice,
  formatTitle,
} from "../utils";
import propertiesService from "../services/propertiesService";
import { MdBathroom, MdBedroomParent } from "react-icons/md";

const PropertyDetailPage = () => {
  const [property, setProperty] = useState<Property>({} as Property);
  const [loading, setLoading] = useState<boolean>(true);

  const [expanded, setExpanded] = useState(false);
  const maxChars = 300;
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const spanStyle =
    "flex flex-row gap-2 items-center bg-gray-200 py-2 px-4 rounded-md text-sm";
  const { id } = useParams();
  useEffect(() => {
    const getProperty = async () => {
      try {
        const fetchedProperties = await propertiesService.getPropertyById(id!);
        setProperty(fetchedProperties);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    };
    getProperty();
  }, []);

  if (!id) {
    return <p>Property not found</p>;
  }
  if (!property) {
    return <p>Property not found</p>;
  }

  if (loading)
    return <p className="text-center text-lg">Chargement de propriété...</p>;

  if (!property._id)
    return <p className="text-center text-lg">Aucune propriété trouvée.</p>;

  const whatsappUrl = createWhatsappUrl(property.ref, property.title);
  const breadcrumbItems = [
    { name: "Acceuil", href: "/" },
    { name: "Annonces", href: "/listings" },
    { name: property.title },
  ];
  // const similarListings = useMemo(() => {
  //   return properties
  //     .filter(
  //       (prop) =>
  //         property.type?.toLowerCase() === prop.type?.toLowerCase() &&
  //         property._id !== prop._id,
  //     )
  //     .slice(0, 7);
  // }, [property]);
  if (!property._id)
    return <p className="text-center text-lg">Chargement des propriétés...</p>;

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
        {formatTitle(property.location)}
      </p>
      <p className="font-medium mt-4 mb-2">Description:</p>
      <p className="text-sm text-gray-600 whitespace-pre-line">
        {expanded
          ? property.description
          : property.description.slice(0, maxChars) +
            (property.description.length > maxChars ? "..." : "")}
      </p>
      {property.description.length > maxChars && (
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
        {property.bathrooms != null && property.bathrooms > 0 && (
          <span className={`${spanStyle}`}>
            <MdBathroom /> {property.bathrooms} salle
            {property.bathrooms > 1 ? "s" : ""} de bain
          </span>
        )}
        {property.floor != null && (
          <span className={`${spanStyle}`}>
            <FaBuilding className="text-lg" />
            {formatFloor(property.floor)}
          </span>
        )}
        {property.parking ? (
          <span>
            <FaParking />
            Parking
          </span>
        ) : null}

        {property.area != null && (
          <span className={`${spanStyle}`}>
            <FaRuler /> {property.area} m²
          </span>
        )}
      </div>
      <p className="mt-6 text-2xl font-semibold text-primary">
        {formatPrice(property.price)}
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
    </motion.div>
  );
};

export default PropertyDetailPage;
