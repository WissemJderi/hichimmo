import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import PropertyCard from "./PropertyCard";
import { Location, Property, PropertyType } from "../../types/Property";

vi.mock("./Embla/EmblaCarousel", () => ({
  default: () => <div data-testid="embla-carousel" />,
}));

const property: Property = {
  _id: "abc123",
  title: "Duplex moderne à Sousse",
  ref: "ABC-1",
  description: "Un beau duplex",
  price: 120000,
  propertyType: PropertyType.Appartement,
  location: Location.Sousse,
  area: 90,
  status: "sale",
  images: ["https://example.com/img1.jpg"],
  floor: 2,
  parking: true,
  bedrooms: 3,
  bathrooms: 2,
};

describe("PropertyCard", () => {
  it("renders title, location, price and details link", () => {
    render(
      <MemoryRouter>
        <PropertyCard {...property} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Duplex moderne à Sousse")).toBeInTheDocument();
    expect(screen.getByText("Sousse")).toBeInTheDocument();
    expect(screen.getByText(/120\s000 DT/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Voir le détail" })).toHaveAttribute(
      "href",
      "/listings/abc123",
    );
  });

  it("shows existing features only", () => {
    render(
      <MemoryRouter>
        <PropertyCard {...property} />
      </MemoryRouter>,
    );

    expect(screen.getByText("3 Ch.")).toBeInTheDocument();
    expect(screen.getByText("2 SDB")).toBeInTheDocument();
    expect(screen.getByText("2e étage")).toBeInTheDocument();
    expect(screen.getByText("Parking")).toBeInTheDocument();
    expect(screen.getByText("90 m²")).toBeInTheDocument();
  });

  it("hides missing features", () => {
    const minimal: Property = {
      ...property,
      floor: undefined,
      parking: false,
      bedrooms: undefined,
      bathrooms: undefined,
      area: undefined as never,
    };
    render(
      <MemoryRouter>
        <PropertyCard {...minimal} />
      </MemoryRouter>,
    );

    expect(screen.queryByText(/Ch\./)).not.toBeInTheDocument();
    expect(screen.queryByText("Parking")).not.toBeInTheDocument();
    expect(screen.queryByText(/m²/)).not.toBeInTheDocument();
    expect(screen.queryByText(/étage/)).not.toBeInTheDocument();
  });
});