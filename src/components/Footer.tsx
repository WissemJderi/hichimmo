import { FaFacebook, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router";
import { formatNumber, phoneNumber } from "../utils";

const contactInfo = [
  { text: "Sousse, Tunisie", icon: <FaMapMarkerAlt aria-hidden="true" /> },
  {
    text: `+216 ${formatNumber(phoneNumber)}`,
    icon: <FaPhone aria-hidden="true" />,
    href: `tel:+216${phoneNumber}`,
  },
  {
    text: "contact@agence.com",
    icon: <MdEmail aria-hidden="true" />,
    href: `mailto:contact@agence.com`,
  },
];

const footerLinks = [
  {
    text: "Whatsapp",
    icon: <IoLogoWhatsapp aria-hidden="true" />,
    href: "https://wa.me/21698622442",
  },
  {
    text: "Facebook",
    icon: <FaFacebook aria-hidden="true" />,
    href: "https://facebook.com/yourpage",
  },
];

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Hichem Immobilière
            </h3>
            <p className="mt-4 text-sm">
              Votre partenaire de confiance pour l’achat, la vente et la
              location de biens à Sousse et ses environs.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Liens rapides</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/listings" className="hover:text-white">
                  Recherche / Annonces
                </Link>
              </li>
              <li>
                <a href="/#services" className="hover:text-white">
                  Services
                </a>
              </li>
              <li>
                <a href="/#about" className="hover:text-white">
                  À propos
                </a>
              </li>
              <li>
                <a href={`tel:+216${phoneNumber}`} className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {contactInfo.map((info) => {
                return info.href ? (
                  <a
                    key={info.text}
                    className="flex flex-row gap-2 items-center underline"
                    href={info.href}
                  >
                    {info.icon} {info.text}
                  </a>
                ) : (
                  <li
                    key={info.text}
                    className="flex flex-row gap-2 items-center"
                  >
                    {info.icon} {info.text}
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 flex space-x-4">
              {footerLinks.map((link) => {
                return (
                  <a
                    key={link.text}
                    href={link.href}
                    rel="noopener noreferrer"
                    className="flex flex-row gap-2 items-center hover:text-white"
                    aria-label={`Visitez notre page ${link.text}`}
                  >
                    {link.icon}
                    {link.text}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Hichem Immobilière. Tous droits
          réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
