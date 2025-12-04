import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import App from "./App.tsx";
import Listings from "./pages/Listings.tsx";
import Navbar from "./components/Navbar.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/listings" element={<Listings />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
