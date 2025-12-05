import { useState } from "react";
import Logo from "./items/Logo";
import SideBarLiItem from "./items/SideBarLiItem";
import { NavLink } from "react-router";
import { phoneNumber } from "../utils";

const Navbar = () => {
  const sideNavLiStyle = "border-b border-gray-400 p-3";
  const [isOpen, setIsOpen] = useState(false);
  const liItems = [
    { to: "/", text: "Accueil" },
    { to: "/listings", text: "Recherche / Annonces" },
    { to: "#about", text: "À propos" },
    { to: `tel:+216${phoneNumber}`, text: "Contact" },
  ];

  return (
    <nav className="bg-primary relative z-10 py-4 px-6 text-base font-semibold text-sm flex items-center lg:justify-around justify-between">
      <Logo />

      <button
        className="text-white lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              isOpen
                ? ""
                : // Hamburger
                  "M4 6h16M4 12h16M4 18h16"
            }
          />
        </svg>
      </button>

      <ul className="hidden lg:flex flex-row gap-6 text-white">
        {liItems.map((li) => {
          return (
            <li key={li.text}>
              {li.to.startsWith("#") ? (
                <a href={li.to}>{li.text}</a>
              ) : (
                <NavLink to={li.to}>{li.text}</NavLink>
              )}
            </li>
          );
        })}
      </ul>

      <div
        className={`fixed inset-y-0 left-0 w-64 bg-primary text-white  lg:hidden z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ul className="flex flex-col ">
          <li
            className={`${sideNavLiStyle} flex flex-row justify-between items-center`}
            onClick={() => setIsOpen(false)}
          >
            <Logo />
            <button
              className="text-white lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isOpen
                      ? // X icon
                        "M6 18L18 6M6 6l12 12"
                      : ""
                  }
                />
              </svg>
            </button>
          </li>
          {liItems.map((li) => {
            const isHash = li.to.startsWith("#");

            return isHash ? (
              <a
                key={li.text}
                href={li.to}
                className={sideNavLiStyle}
                onClick={() => setIsOpen(false)}
              >
                {li.text}
              </a>
            ) : (
              <SideBarLiItem
                key={li.text}
                to={li.to}
                text={li.text}
                onClick={() => setIsOpen(false)}
              />
            );
          })}
        </ul>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 bg-opacity-50 lg:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
