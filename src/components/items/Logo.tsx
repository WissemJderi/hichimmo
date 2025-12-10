import { NavLink } from "react-router";

const Logo = () => {
  return (
    <NavLink
      to="/"
      className="text-white font-bold text-lg"
      aria-label="Retour à l'accueil - Dahech Immobilière"
    >
      Dahech Immobilière
    </NavLink>
  );
};

export default Logo;
