import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import App from "./App.tsx";
import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import ScrollToTopButton from "./components/items/ScrollToTopButton.tsx";
import LoginPage from "./pages/admin/LoginPage.tsx";
import Dashboard from "./pages/admin/Dashboard.tsx";
import AddPropertyForm from "./pages/admin/AddPropertyForm.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";

const Listings = React.lazy(() => import("./pages/Listings"));
const PropertyDetailPage = React.lazy(
  () => import("./pages/PropertyDetailPage"),
);

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ScrollToTop />
      <main className="grow">
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:id" element={<PropertyDetailPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/new-property"
            element={
              <ProtectedRoute>
                <AddPropertyForm />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />

      <ScrollToTopButton />
    </div>
  );
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </StrictMode>,
);
