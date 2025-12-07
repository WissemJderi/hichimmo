import CTA from "./components/CTA";
import Hero from "./components/Hero";
import ServicesOffered from "./components/ServicesOffered";
import AboutAgent from "./components/AboutAgent";
import FeaturedListings from "./components/FeaturedListings";

function App() {
  return (
    <main>
      <Hero />
      <FeaturedListings />
      <AboutAgent />
      <ServicesOffered />
      <CTA />
    </main>
  );
}

export default App;
