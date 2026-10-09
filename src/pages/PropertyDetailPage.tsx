import { Link, useParams } from "react-router";

// Icons
import {
  FaBuilding,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaParking,
  FaPhoneAlt,
  FaRuler,
  FaShieldAlt,
} from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdBathroom, MdBedroomParent } from "react-icons/md";
import Breadcrumb from "../components/items/Breadcrumb";
import EmblaCarousel from "../components/items/Embla/EmblaCarousel";
import PropertyCard from "../components/items/PropertyCard";
import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Property } from "../types/Property";
import {
  createWhatsappUrl,
  formatFloor,
  formatNumber,
  formatPrice,
  formatTitle,
  phoneNumber,
} from "../utils";
import propertiesService from "../services/propertiesService";

const MAX_DESCRIPTION_BLOCKS = 3;

type Spec = { icon: ReactNode; value: string; label: string };

const PropertyDetailPage = () => {
  const [property, setProperty] = useState<Property>({} as Property);
  const [related, setRelated] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expanded, setExpanded] = useState(false);

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
  }, [id]);

  useEffect(() => {
    const getRelated = async () => {
      if (!property._id) return;
      if (typeof propertiesService.searchPaginated !== "function") return;
      try {
        const result = await propertiesService.searchPaginated(
          property.location,
          property.propertyType,
          1,
          9,
        );
        setRelated(
          result.properties.filter((p) => p._id !== property._id).slice(0, 8),
        );
      } catch (error) {
        console.error("Failed to fetch related properties:", error);
      }
    };
    getRelated();
  }, [property._id, property.location, property.propertyType]);

  if (!id) {
    return (
      <p className="text-center text-lg py-12">Aucune propriété trouvée.</p>
    );
  }
  if (!property) {
    return (
      <p className="text-center text-lg py-12">Aucune propriété trouvée.</p>
    );
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

  const statusLabel =
    property.status === "sale"
      ? "À vendre"
      : property.status === "rent"
        ? "À louer"
        : null;

  const specs = (
    [
      property.bedrooms != null && property.bedrooms > 0
        ? {
            icon: <MdBedroomParent />,
            value: String(property.bedrooms),
            label: "Chambres",
          }
        : null,
      property.bathrooms != null && property.bathrooms > 0
        ? {
            icon: <MdBathroom />,
            value: String(property.bathrooms),
            label: "SDB",
          }
        : null,
      property.area != null
        ? {
            icon: <FaRuler />,
            value: `${property.area} m²`,
            label: "Surface",
          }
        : null,
      property.floor != null
        ? {
            icon: <FaBuilding />,
            value: formatFloor(property.floor),
            label: "Étage",
          }
        : null,
      property.parking
        ? { icon: <FaParking />, value: "Oui", label: "Parking" }
        : null,
    ] as (Spec | null)[]
  ).filter((s): s is Spec => s !== null);

  const rawDescription = property.longDescription || property.description || "";
  const descriptionBlocks = rawDescription
    .split(/(?:\r?\n){2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
  const visibleBlocks = expanded
    ? descriptionBlocks
    : descriptionBlocks.slice(0, MAX_DESCRIPTION_BLOCKS);
  const hasMoreBlocks = descriptionBlocks.length > MAX_DESCRIPTION_BLOCKS;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-7xl px-6 py-10 pb-24 font-lato lg:pb-10"
    >
      <Breadcrumb items={breadcrumbItems} />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
        {/* ===== LEFT ===== */}
        <div className="min-w-0">
          <div className="relative">
            <EmblaCarousel
              slides={property.images}
              rounded
              showThumbnails
              showCounter
            />
            {statusLabel && (
              <span className="absolute left-4 top-4 z-10 rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary shadow-sm">
                {statusLabel}
              </span>
            )}
          </div>

          <div className="mt-6">
            <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.18em] text-primary/60">
              {property.propertyType} · Réf. {property.ref}
            </p>
            <h1 className="mt-2 font-montserrat text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl">
              {property.title}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-base font-medium text-gray-600">
              <FaMapMarkerAlt className="shrink-0 text-primary" aria-hidden />
              {formatTitle(property.location)}
            </p>
          </div>

          {specs.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex flex-col items-center gap-1 rounded-xl border border-gray-100 bg-white px-2 py-3 text-center shadow-sm"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/5 text-primary [&>svg]:h-4 [&>svg]:w-4">
                    {spec.icon}
                  </span>
                  <span className="font-montserrat text-sm font-bold text-gray-900">
                    {spec.value}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    {spec.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {descriptionBlocks.length > 0 && (
            <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
              <h2 className="font-montserrat text-lg font-bold text-gray-900">
                Description
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-600">
                {visibleBlocks.map((block, index) => {
                  const [firstLine, ...restLines] = block.split(/\r?\n/);
                  const body = restLines.join("\n").trim();
                  const hasTitle = body.length > 0 && firstLine.length <= 80;
                  return (
                    <p key={index} className="whitespace-pre-line">
                      {hasTitle ? (
                        <>
                          <span className="font-bold text-gray-800">
                            {firstLine}
                          </span>
                          {"\n"}
                          {body}
                        </>
                      ) : (
                        block
                      )}
                    </p>
                  );
                })}
              </div>

              {property.features && property.features.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {property.features.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-primary"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              )}

              {hasMoreBlocks && (
                <button
                  type="button"
                  onClick={() => setExpanded((value) => !value)}
                  className="mt-4 cursor-pointer text-sm font-semibold text-primary hover:underline"
                >
                  {expanded ? "Voir moins" : "Voir plus"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* ===== RIGHT · sticky ===== */}
        <div className="min-w-0">
          <div className="space-y-4 lg:sticky lg:top-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    {property.status === "rent" ? "Loyer mensuel" : "Prix"}
                  </p>
                  <p className="whitespace-nowrap font-montserrat text-3xl font-extrabold text-primary">
                    {formatPrice(property.price)}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-primary/5 px-2.5 py-1 text-[11px] font-bold text-primary">
                  {property.ref}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 text-sm">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    Type
                  </p>
                  <p className="font-semibold capitalize text-gray-800">
                    {property.propertyType}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    Statut
                  </p>
                  <p className="font-semibold text-gray-800">
                    {statusLabel ?? "—"}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg bg-green-500 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-green-600"
                >
                  <IoLogoWhatsapp className="text-lg" aria-hidden />
                  Contacter via WhatsApp
                </a>
                <a
                  href={`tel:+216${phoneNumber}`}
                  className="flex items-center justify-center gap-2 rounded-lg border border-primary/25 px-5 py-3 font-semibold text-primary transition hover:bg-primary hover:text-white"
                >
                  <FaPhoneAlt aria-hidden />
                  {formatNumber(phoneNumber)}
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                <FaShieldAlt className="text-primary" aria-hidden />
                Bien vérifié par l'agence
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-gray-600">
                <FaCheckCircle className="text-primary" aria-hidden />
                Visite sur rendez-vous
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== RELATED LISTINGS · swipe rail ===== */}
      {related.length > 0 && (
        <section className="mt-10 border-t border-gray-100 pt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-montserrat text-xl font-bold text-gray-900 sm:text-2xl">
                Biens similaires à {formatTitle(property.location)}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Autres biens qui pourraient vous intéresser.
              </p>
            </div>
            <Link
              to="/listings"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition hover:text-primary-hover"
            >
              Voir toutes les annonces
            </Link>
          </div>

          <div className="no-scrollbar mt-5 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2">
            {related.map((item, index) => (
              <div
                key={item._id || `${item.ref}-${index}`}
                className="w-[280px] shrink-0 snap-start"
              >
                <PropertyCard {...item} area={item.area ?? undefined} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== MOBILE action bar ===== */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ouvrir WhatsApp"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-500 py-2.5 text-sm font-semibold text-white"
        >
          <IoLogoWhatsapp className="text-lg" aria-hidden />
          WhatsApp
        </a>
        <a
          href={`tel:+216${phoneNumber}`}
          aria-label="Appeler l'agence"
          className="grid h-10 w-12 place-items-center rounded-lg border border-primary/25 text-primary"
        >
          <FaPhoneAlt aria-hidden />
        </a>
      </div>
    </motion.div>
  );
};

export default PropertyDetailPage;
