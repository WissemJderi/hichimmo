import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import PropertyDetailPage from "./PropertyDetailPage";
import { Location, Property, PropertyType } from "../types/Property";
import propertiesService from "../services/propertiesService";

vi.mock("../components/items/Embla/EmblaCarousel", () => ({
  default: () => <div data-testid="embla-carousel" />,
}));

vi.mock("../services/propertiesService", () => ({
  default: {
    getPropertyById: vi.fn(),
  },
}));

const property: Property = {
  _id: "abc123",
  title: "Villa de luxe à Kantaoui",
  ref: "VIL-7",
  description: "Une villa superbe avec piscine.",
  price: 850000,
  propertyType: PropertyType.Villa,
  location: Location.Kantaoui,
  area: 250,
  status: "sale",
  images: ["https://example.com/villa.jpg"],
};

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/listings/abc123"]}>
      <Routes>
        <Route path="/listings/:id" element={<PropertyDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );

describe("PropertyDetailPage", () => {
  it("shows a loading text then the fetched property", async () => {
    vi.mocked(propertiesService.getPropertyById).mockResolvedValue(property);

    renderPage();

    expect(
      screen.getByText("Chargement de propriété..."),
    ).toBeInTheDocument();

    expect(
      await screen.findByRole("heading", { level: 1, name: "Villa de luxe à Kantaoui" }),
    ).toBeInTheDocument();
    expect(propertiesService.getPropertyById).toHaveBeenCalledWith("abc123");
  });

  it("displays details, price and contact link", async () => {
    vi.mocked(propertiesService.getPropertyById).mockResolvedValue(property);

    renderPage();

    expect(await screen.findByText("Kantaoui")).toBeInTheDocument();
    expect(screen.getByText(/850\s000 DT/)).toBeInTheDocument();
    const whatsappLink = screen.getByRole("link", {
      name: /Contacter via WhatsApp/,
    });
    expect(whatsappLink).toHaveAttribute("href", expect.stringContaining("wa.me"));
    expect(whatsappLink).toHaveAttribute("target", "_blank");
  });
});