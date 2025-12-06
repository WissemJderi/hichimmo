import { FaBriefcase, FaKey, FaMoneyBill } from "react-icons/fa";
import { TiHome } from "react-icons/ti";

const ServicesOffered = () => {
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
  return (
    <section id="services" className="bg-gray-50 py-16 font-lato">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-3xl font-bold font-montserrat tracking-tight text-gray-900 sm:text-4xl text-center">
          Services proposés
        </h2>
        <p className="mt-4 text-lg text-gray-600 text-center">
          Découvrez l’ensemble des solutions que nous mettons à votre
          disposition.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-lg bg-white p-6 shadow hover:shadow-lg transition"
            >
              <service.icon className="h-10 w-10 text-primary self-center" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {service.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesOffered;
