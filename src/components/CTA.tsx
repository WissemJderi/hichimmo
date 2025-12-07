import { Link } from "react-router";
import { phoneNumber } from "../utils";
import { motion } from "framer-motion";

const CTA = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      aria-labelledby="cta-heading"
      className="bg-base"
    >
      <div className="mx-auto max-w-7xl px-6 py-16 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          id="cta-heading"
          className="text-3xl font-bold tracking-tight text-primary sm:text-4xl"
        >
          Prêt à trouver votre bien idéal ?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          className="mt-4 text-lg text-primary"
        >
          Contactez-nous dès aujourd’hui pour une estimation gratuite ou une
          visite personnalisée.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-8 flex justify-center"
        >
          <Link
            to={`tel:+216${phoneNumber}`}
            className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-base shadow hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Appeler pour une estimation gratuite ou une visite personnalisée"
          >
            Contactez-nous
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CTA;
