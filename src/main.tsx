import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import App from "./App.tsx";
import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import ScrollToTopButton from "./components/items/ScrollToTopButton.tsx";

const Listings = React.lazy(() => import("./pages/Listings"));
const PropertyDetailPage = React.lazy(
  () => import("./pages/PropertyDetailPage"),
);

function Layout() {
  return (
    <>
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<PropertyDetailPage />} />
      </Routes>
      <Footer />
      <ScrollToTopButton />
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </StrictMode>,
);
