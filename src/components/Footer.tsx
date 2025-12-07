import { FaFacebook, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router";
import { formatNumber, phoneNumber } from "../utils";
import { motion } from "framer-motion";

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

const columnVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-gray-900 text-gray-300"
    >
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
          className="grid gap-8 md:grid-cols-3"
        >
          <motion.div variants={columnVariants}>
            <h3 className="text-lg font-semibold text-white">
              Hichem Immobilière
            </h3>
            <p className="mt-4 text-sm">
              Votre partenaire de confiance pour l’achat, la vente et la
              location de biens à Sousse et ses environs.
            </p>
          </motion.div>

          <motion.div variants={columnVariants}>
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
          </motion.div>

          <motion.div variants={columnVariants}>
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
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={link.text}
                    href={link.href}
                    rel="noopener noreferrer"
                    className="flex flex-row gap-2 items-center hover:text-white"
                    aria-label={`Visitez notre page ${link.text}`}
                  >
                    {link.icon}
                    {link.text}
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-400"
        >
          © {new Date().getFullYear()} Hichem Immobilière. Tous droits
          réservés.
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
