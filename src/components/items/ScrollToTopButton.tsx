import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

const SCROLL_THRESHOLD = 300;
const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > SCROLL_THRESHOLD) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;
  return (
    <button
      title="Retour en haut"
      onClick={scrollToTop}
      aria-label="Revenir en haut de la page"
      className="fixed bottom-6 right-6 p-3 rounded-full bg-primary cursor-pointer text-white shadow-lg hover:bg-primary-hover transition-all"
    >
      <FaArrowUp size={20} aria-hidden="true" />
    </button>
  );
};

export default ScrollToTopButton;
