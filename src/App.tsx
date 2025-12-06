import AboutAgent from "./components/AboutAgent";
import CTA from "./components/CTA";
import FeaturedListings from "./components/FeaturedListings";
import Hero from "./components/Hero";
import EmblaCarousel from "./components/items/EmblaCarousel";
import ServicesOffered from "./components/ServicesOffered";
import "./embla.css";
const images = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1600&auto=format&fit=crop",
];
function App() {
  return (
    <>
      <Hero />
      <FeaturedListings />
      <AboutAgent />
      <ServicesOffered />
      <CTA />
    </>
  );
}

export default App;
