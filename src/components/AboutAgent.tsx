import { FaHandshake, FaMapMarkerAlt } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { Link } from "react-router";

const AboutAgent = () => {
  const adventages = [
    {
      text: "Accompagnement personnalisé et transparent",
      icon: <FaHandshake />,
    },
    {
      text: "Expertise locale : Sahloul, Hammam Sousse, Kantaoui, et plus",
      icon: <FaMapMarkerAlt />,
    },
    {
      text: "Services complets : achat, vente, location, investissement",
      icon: <FaHouse />,
    },
  ];
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative h-80 w-full overflow-hidden rounded-lg shadow-lg lg:h-full">
            <img
              src="https://unsplash.com/photos/HfMCgqOLTyM/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTR8fHJlYWwlMjBlc3RhdGUlMjBhZ2VudHxlbnwwfHx8fDE3NjQ4MzcwODJ8MA&force=true&w=1920"
              alt="Agent portrait"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="font-lato">
            <h2 className="font-montserrat text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              À propos de votre agent
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Spécialiste de l’immobilier à Sousse et ses environs, je vous
              accompagne dans l’achat, la vente ou la location de biens
              résidentiels et commerciaux. Mon objectif est de vous offrir un
              service personnalisé et transparent, pour que chaque projet
              devienne une réussite.
            </p>

            <ul className="mt-6 space-y-4 text-gray-700">
              {adventages.map((adventage) => {
                return (
                  <li key={adventage.text} className="flex items-center gap-3">
                    <span className="text-primary">{adventage.icon}</span>
                    {adventage.text}
                  </li>
                );
              })}
            </ul>

            <div className="mt-8">
              <Link
                to="tel:+21612345678"
                className="inline-block rounded-md bg-primary px-6 py-3 text-sm font-medium text-white shadow hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Contactez-moi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutAgent;
