import React from "react";
import { Link } from "react-router";
import type { BreadcrumbProps } from "../../interfaces";
import { FaCircleChevronLeft } from "react-icons/fa6";

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 ">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center text-xs font-semibold">
              {item.href && !isLast ? (
                <Link to={item.href} className="hover:text-gray-900">
                  {item.name}
                </Link>
              ) : (
                <span className="text-gray-900 font-semibold">{item.name}</span>
              )}
              {!isLast && (
                <FaCircleChevronLeft className="w-4 h-4 mx-1 text-primary" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
