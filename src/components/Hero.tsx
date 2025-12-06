import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { phoneNumber } from "../utils";
import { locations, properties } from "../data";
const Hero = () => {
  const [propertyType, setPropertyType] = useState({
    type: properties[0],
    location: locations[0],
  });
  const navigate = useNavigate();
  return (
    <main>
      <section className="relative isolate overflow-hidden bg-gray-900">
        <img
          src="/hero.webp"
          alt="Real estate background"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />

        <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/60 via-black/50 to-black/30"></div>

        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:py-32">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl font-montserrat">
              Trouvez le bien immobilier qui vous correspond
            </h1>
            <p className="mt-5 text-gray-200 sm:text-lg font-lato">
              Appartements, maisons, bureaux ou terrains — un accompagnement sur
              mesure pour chaque projet.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row font-lato">
              <Link
                to="/listings"
                className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                Découvrir nos biens
              </Link>
              <Link
                to={`tel:+216${phoneNumber}`}
                className="inline-flex items-center justify-center rounded-md bg-white/10 px-5 py-3 text-sm font-medium text-white ring-1 ring-inset ring-white/30 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                Appelez pour plus d’informations
              </Link>
            </div>

            <form
              className="font-lato mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3"
              id="search"
            >
              <label className="sr-only" htmlFor="location">
                Localisation
              </label>
              <select
                id="location"
                onChange={(e) => {
                  setPropertyType((prev) => {
                    return { ...prev, location: e.target.value };
                  });
                }}
                className="cursor-pointer rounded-md border-0 bg-white/90 px-4 py-3 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-white/30 backdrop-blur focus:ring-2 focus:ring-white/60"
              >
                {locations.map((location) => {
                  return (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  );
                })}
              </select>

              <label className="sr-only" htmlFor="type">
                Type
              </label>
              <select
                id="type"
                onChange={(e) => {
                  setPropertyType((prev) => {
                    return { ...prev, type: e.target.value };
                  });
                }}
                className="cursor-pointer rounded-md border-0 bg-white/90 px-4 py-3 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-white/30 backdrop-blur focus:ring-2 focus:ring-white/60"
              >
                {properties.map((property) => {
                  return (
                    <option key={property} value={property}>
                      {property}
                    </option>
                  );
                })}
              </select>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-white px-4 py-3 text-sm  text-gray-900 shadow-sm hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 cursor-pointer font-semibold"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(
                    `/listings?type=${encodeURIComponent(propertyType.type)}&location=${encodeURIComponent(propertyType.location)}`,
                  );
                }}
              >
                Rechercher
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Hero;
