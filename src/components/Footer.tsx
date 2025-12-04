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
    },
    {
      text: "contact@agence.com",
      icon: <MdEmail />,
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
              Agence Immobilière
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
                <a href="/about" className="hover:text-white">
                  À propos
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-white">
                  Services
                </a>
              </li>
              <li>
                <a href="/listings" className="hover:text-white">
                  Biens disponibles
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {contactInfo.map((info) => {
                return (
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
          © {new Date().getFullYear()} Agence Immobilière. Tous droits
          réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
