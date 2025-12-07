import { Link } from "react-router";
import { phoneNumber } from "../utils";

const CTA = () => {
  return (
    <section aria-labelledby="cta-heading" className="bg-base">
      <div className="mx-auto max-w-7xl px-6 py-16 text-center">
        <h2
          id="cta-heading"
          className="text-3xl font-bold tracking-tight text-primary sm:text-4xl"
        >
          Prêt à trouver votre bien idéal ?
        </h2>
        <p className="mt-4 text-lg text-primary">
          Contactez-nous dès aujourd’hui pour une estimation gratuite ou une
          visite personnalisée.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            to={`tel:+216${phoneNumber}`}
            className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-base shadow hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Appeler pour une estimation gratuite ou une visite personnalisée"
          >
            Contactez-nous
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
