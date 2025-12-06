import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import App from "./App.tsx";
import Listings from "./pages/Listings.tsx";
import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
import PropertyDetailPage from "./pages/PropertyDetailPage.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import ScrollToTopButton from "./components/items/ScrollToTopButton.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<PropertyDetailPage />} />
      </Routes>
      <Footer />
      <ScrollToTopButton />
    </BrowserRouter>
  </StrictMode>,
);
