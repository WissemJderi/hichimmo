import { useParams } from "react-router";
import properties from "../properties.json";
// Icons
import { MdBathroom, MdBedroomParent } from "react-icons/md";
import { FaRuler } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
const PropertyDetailPage = () => {
  const { id } = useParams();
  if (!id) {
    return <p>Property not found</p>;
  }
  const property = properties.find((p) => p.id === parseInt(id, 10));
  if (!property) {
    return <p>Property not found</p>;
  }
  const hour = new Date().getHours();

  let greeting;
  if (hour < 12) {
    greeting = "Bonjour"; // Morning
  } else if (hour < 18) {
    greeting = "Bon après-midi"; // Afternoon
  } else {
    greeting = "Bonsoir"; // Evening
  }
  const whatsappNumber = "21698622442"; // Example: Tunisia number
  const message = `${greeting}, je suis intéressé par le bien avec la référence ${property.id} (${property.title}). Est-il encore disponible ?`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 font-lato">
      <img
        src={property.image}
        alt={property.title}
        className="w-full h-96 object-cover rounded-lg shadow"
      />
      <h1 className="mt-6 text-3xl font-bold font-montserrat">
        {property.title}
      </h1>
      <p className="mt-2 text-lg text-gray-700">{property.location}</p>
      <p className="mt-4 text-gray-600">{property.longDescription}</p>

      <div className="mt-6 flex gap-6 text-gray-800">
        {property.bedrooms > 0 && (
          <span className="flex flex-row gap-2 items-center">
            <MdBedroomParent /> {property.bedrooms} m²
          </span>
        )}
        <span className="flex flex-row gap-2 items-center">
          <MdBathroom /> {property.bathrooms} m²
        </span>

        <span className="flex flex-row gap-2 items-center">
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
    </div>
  );
};

export default PropertyDetailPage;
