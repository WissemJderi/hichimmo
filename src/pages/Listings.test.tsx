import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import Listings from "./Listings";
import propertiesService from "../services/propertiesService";
import { Location, Property, PropertyType } from "../types/Property";

vi.mock("../services/propertiesService", () => ({
  default: {
    getPaginated: vi.fn(),
    searchPaginated: vi.fn(),
  },
}));

vi.mock("../components/items/Embla/EmblaCarousel", () => ({
  default: () => <div data-testid="embla-carousel" />,
}));

const property = (overrides: Partial<Property> = {}): Property => ({
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
  ...overrides,
});

const renderListings = (initialPath = "/listings") =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Listings />
    </MemoryRouter>,
  );

describe("Listings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading then the fetched properties", async () => {
    vi.mocked(propertiesService.getPaginated).mockResolvedValue({
      properties: [property()],
      total: 1,
    });

    renderListings();

    expect(screen.getByText("Chargement des propriétés...")).toBeInTheDocument();
    expect(await screen.findByText("Duplex moderne à Sousse")).toBeInTheDocument();
    expect(propertiesService.getPaginated).toHaveBeenCalledWith(1, 9);
  });

  it("shows an empty state when no properties are found", async () => {
    vi.mocked(propertiesService.getPaginated).mockResolvedValue({
      properties: [],
      total: 0,
    });

    renderListings();

    expect(await screen.findByText("Aucune propriété trouvée.")).toBeInTheDocument();
  });

  it("searches with filters when location and type params are present", async () => {
    vi.mocked(propertiesService.searchPaginated).mockResolvedValue({
      properties: [property()],
      total: 1,
    });

    renderListings("/listings?type=appartement&location=sousse");

    expect(await screen.findByText("Duplex moderne à Sousse")).toBeInTheDocument();
    expect(propertiesService.searchPaginated).toHaveBeenCalledWith(
      "sousse",
      "appartement",
      1,
      9,
    );
    expect(propertiesService.getPaginated).not.toHaveBeenCalled();
  });

  it("appends the next page when 'Charger plus' is clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(propertiesService.getPaginated)
      .mockResolvedValueOnce({ properties: [property()], total: 2 })
      .mockResolvedValueOnce({
        properties: [property({ _id: "def456", title: "Villa à Kantaoui" })],
        total: 2,
      });

    renderListings();

    expect(await screen.findByText("Duplex moderne à Sousse")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Charger plus" }));

    expect(await screen.findByText("Villa à Kantaoui")).toBeInTheDocument();
    expect(propertiesService.getPaginated).toHaveBeenLastCalledWith(2, 9);
    expect(screen.queryByRole("button", { name: "Charger plus" })).not.toBeInTheDocument();
  });
});
