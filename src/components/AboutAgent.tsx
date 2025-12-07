import { FaHandshake, FaMapMarkerAlt } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { Link } from "react-router";
import { phoneNumber } from "../utils";
import { motion } from "framer-motion";

const AboutAgent = () => {
  const adventages = [
    {
      text: "Accompagnement personnalisé et transparent",
      icon: FaHandshake,
    },
    {
      text: "Expertise locale : Sahloul, Hammam Sousse, Khzema, et plus",
      icon: FaMapMarkerAlt,
    },
    {
      text: "Services complets : achat, vente, location, investissement",
      icon: FaHouse,
    },
  ];
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      id="about"
      className="bg-white py-16"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative h-80 w-full overflow-hidden rounded-lg shadow-lg lg:h-full"
          >
            <img
              src="https://unsplash.com/photos/HfMCgqOLTyM/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTR8fHJlYWwlMjBlc3RhdGUlMjBhZ2VudHxlbnwwfHx8fDE3NjQ4MzcwODJ8MA&force=true&w=1920"
              alt="Agent portrait"
              className="h-full w-full object-cover"
              width={1920}
              height={1080}
            />
          </motion.div>

          <div className="font-lato">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="font-montserrat text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            >
              À propos de votre agent
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="mt-4 text-lg text-gray-600"
            >
              Spécialiste de l’immobilier à Sousse et ses environs, je vous
              accompagne dans l’achat, la vente ou la location de biens
              résidentiels et commerciaux. Mon objectif est de vous offrir un
              service personnalisé et transparent, pour que chaque projet
              devienne une réussite.
            </motion.p>

            <motion.ul
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: 0.15 },
                },
              }}
              className="mt-6 space-y-4 text-gray-700"
            >
              {adventages.map(({ text, icon: Icon }) => {
                return (
                  <motion.li
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      show: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.45 }}
                    key={text}
                    className="flex items-center gap-3"
                  >
                    <Icon className="text-primary" />
                    {text}
                  </motion.li>
                );
              })}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <Link
                to={`tel:+216${phoneNumber}`}
                className="inline-block rounded-md bg-primary px-6 py-3 text-sm font-medium text-white shadow hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Contactez-moi
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutAgent;
