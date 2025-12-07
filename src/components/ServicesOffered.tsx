import { FaBriefcase, FaKey, FaMoneyBill } from "react-icons/fa";
import { TiHome } from "react-icons/ti";
import { motion } from "framer-motion";

const services = [
  {
    title: "Achat de biens",
    description:
      "Accompagnement complet pour trouver et acheter le bien idéal.",
    icon: TiHome,
  },
  {
    title: "Vente de biens",
    description:
      "Mise en valeur et diffusion de votre propriété pour une vente rapide et efficace.",
    icon: FaMoneyBill,
  },
  {
    title: "Location",
    description:
      "Solutions adaptées pour louer ou mettre en location vos biens résidentiels et commerciaux.",
    icon: FaKey,
  },
  {
    title: "Investissement",
    description:
      "Conseils stratégiques pour optimiser vos projets immobiliers et placements.",
    icon: FaBriefcase,
  },
];

const ServicesOffered = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      id="services"
      className="bg-gray-50 py-16 font-lato"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-bold font-montserrat tracking-tight text-gray-900 sm:text-4xl text-center"
        >
          Services proposés
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="mt-4 text-lg text-gray-600 text-center"
        >
          Découvrez l’ensemble des solutions que nous mettons à votre
          disposition.
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.15 },
            },
          }}
          className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="rounded-lg bg-white p-6 shadow hover:shadow-lg transition"
            >
              <Icon className="h-10 w-10 text-primary self-center" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{description}</p>
            </article>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ServicesOffered;
