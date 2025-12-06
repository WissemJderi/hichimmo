import { FaFacebook, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router";
import { formatNumber, phoneNumber } from "../utils";

const Footer = () => {
  const contactInfo = [
    { text: "Sousse, Tunisie", icon: <FaMapMarkerAlt /> },
    {
      text: `+216 ${formatNumber(phoneNumber)}`,
      icon: <FaPhone />,
      to: `tel:+216${phoneNumber}`,
    },
    {
      text: "contact@agence.com",
      icon: <MdEmail />,
      to: `mailto:contact@agence.com`,
    },
  ];
  const footerLinks = [
    {
      text: "Whatsapp",
      icon: <IoLogoWhatsapp />,
      to: "whatsapp",
    },
    { text: "Facebook", icon: <FaFacebook />, to: "facebook" },
  ];
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
                <Link
                  to={`tel:+216${phoneNumber}`}
                  className="hover:text-white"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {contactInfo.map((info) => {
                return info.to ? (
                  <Link
                    key={info.text}
                    className="flex flex-row gap-2 items-center underline"
                    to={info.to}
                  >
                    <span>{info.icon}</span> {info.text}
                  </Link>
                ) : (
                  <li
                    key={info.text}
                    className="flex flex-row gap-2 items-center"
                  >
                    <span>{info.icon}</span> {info.text}
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 flex space-x-4">
              {footerLinks.map((link) => {
                return (
                  <Link
                    key={link.text}
                    to={link.to}
                    className="flex flex-row gap-2 items-center"
                  >
                    {link.icon}
                    {link.text}
                  </Link>
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
