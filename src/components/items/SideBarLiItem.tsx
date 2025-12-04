import { NavLink } from "react-router";
import type { sideBarListItemProps } from "../../interfaces";

const SideBarLiItem = ({ text, onClick, to }: sideBarListItemProps) => {
  const sideNavLiStyle = "border-b border-gray-400 p-3";
  return (
    <NavLink to={to} className={`${sideNavLiStyle}`} onClick={onClick}>
      {text}
    </NavLink>
  );
};

export default SideBarLiItem;
