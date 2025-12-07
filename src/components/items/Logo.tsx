import { NavLink } from "react-router";

const Logo = () => {
  return (
    <NavLink
      to="/"
      className="text-white font-bold text-lg"
      aria-label="Retour à l'accueil - Hichem Immobilière"
    >
      Hichem Immobilière
    </NavLink>
  );
};

export default Logo;
