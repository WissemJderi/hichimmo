import { useParams } from "react-router";
import properties from "../properties.json";

// Icons
import { MdBathroom, MdBedroomParent } from "react-icons/md";
import { FaMapMarkerAlt, FaRuler } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import Breadcrumb from "../components/items/Breadcrumb";
import PropertyCard from "../components/items/PropertyCard";
const PropertyDetailPage = () => {
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
  const hour = new Date().getHours();

  let greeting;
  if (hour < 12) {
    greeting = "Bonjour";
  } else if (hour < 18) {
    greeting = "Bon après-midi";
  } else {
    greeting = "Bonsoir";
  }
  const whatsappNumber = "21698622442";
  const message = `${greeting}, je suis intéressé par le bien avec la référence ${property.id} (${property.title}). Est-il encore disponible ?`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  const breadcrumbItems = [
    { name: "Acceuil", href: "/" },
    { name: "Annonces", href: "/listings" },
    { name: property.title },
  ];
  const similairLisitng = properties.filter((prop) => {
    return (
      !property.type ||
      (property.type.toLowerCase() === prop.type.toLowerCase() &&
        property.id !== prop.id)
    );
  });

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 font-lato">
      <Breadcrumb items={breadcrumbItems} />
      <img
        src={property.image}
        alt={property.title}
        className="w-full h-96 object-cover rounded-lg shadow"
      />
      <h1 className="mt-6 text-3xl font-bold font-montserrat">
        {property.title}
      </h1>
      <p className="flex flex-row gap-2 font-medium items-center mt-2 text-lg text-gray-700">
        <span>
          <FaMapMarkerAlt />
        </span>
        {property.location}
      </p>
      <p className="mt-4 text-gray-600">{property.longDescription}</p>

      <div className="mt-6 flex gap-4 text-gray-800 flex-wrap">
        {property.bedrooms > 0 && (
          <span className={`${spanStyle}`}>
            <MdBedroomParent /> {property.bedrooms} m²
          </span>
        )}
        <span className={`${spanStyle}`}>
          <MdBathroom /> {property.bathrooms} m²
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
      {similairLisitng.length == 0 ? (
        <h2 className="text-center py-6 text-lg tracking-tight font-montserrat text-gray-900 sm:text-4xl">
          Aucun bien similaire n'a été trouvé
        </h2>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 font-lato">
          {similairLisitng.map((listing) => {
            return (
              <PropertyCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                location={listing.location}
                price={listing.price}
                image={listing.image}
                description={listing.description}
                bedrooms={listing.bedrooms}
                bathrooms={listing.bathrooms}
                area={listing.area}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PropertyDetailPage;
