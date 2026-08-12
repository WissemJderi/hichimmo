import { beforeEach, describe, expect, it, vi } from "vitest";
import { Location, PropertyType } from "../types/Property";
import { API_URL } from "./config";

const { axiosMock } = vi.hoisted(() => ({
  axiosMock: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("axios", () => ({ default: axiosMock }));

import propertiesService from "./propertiesService";

const BASE_URL = `${API_URL}/properties`;

const mockProperty = {
  _id: "abc123",
  title: "Duplex à Sousse",
  ref: "ABC-1",
  description: "Bien spacieux",
  price: 120000,
  propertyType: PropertyType.Appartement,
  location: Location.Sousse,
  area: 90,
  status: "sale" as const,
  images: ["https://example.com/img1.jpg"],
};

describe("propertiesService reads", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getAll calls GET /api/properties", async () => {
    axiosMock.get.mockResolvedValue({ data: [mockProperty] });
    const result = await propertiesService.getAll();
    expect(axiosMock.get).toHaveBeenCalledWith(BASE_URL);
    expect(result).toEqual([mockProperty]);
  });

  it("getPropertyById calls GET /api/properties/<id>", async () => {
    axiosMock.get.mockResolvedValue({ data: mockProperty });
    const result = await propertiesService.getPropertyById("abc123");
    expect(axiosMock.get).toHaveBeenCalledWith(`${BASE_URL}/abc123`);
    expect(result).toEqual(mockProperty);
  });

  it("searchProperties calls GET /api/properties/search with filters", async () => {
    axiosMock.get.mockResolvedValue({
      data: [mockProperty],
      headers: { "x-total-count": "1" },
    });
    const result = await propertiesService.searchProperties(
      Location.Sousse,
      PropertyType.Appartement,
    );
    expect(axiosMock.get).toHaveBeenCalledWith(`${BASE_URL}/search`, {
      params: { location: "sousse", type: "appartement", page: 1, limit: 16 },
    });
    expect(result).toEqual([mockProperty]);
  });

  it("searchProperties omits \"none\" params", async () => {
    axiosMock.get.mockResolvedValue({
      data: [mockProperty],
      headers: { "x-total-count": "1" },
    });
    await propertiesService.searchProperties("none", PropertyType.Villa);
    expect(axiosMock.get).toHaveBeenCalledWith(`${BASE_URL}/search`, {
      params: { type: "villa", page: 1, limit: 16 },
    });
  });

  it("searchProperties with no filters sends only pagination params", async () => {
    axiosMock.get.mockResolvedValue({
      data: [mockProperty],
      headers: { "x-total-count": "1" },
    });
    await propertiesService.searchProperties();
    expect(axiosMock.get).toHaveBeenCalledWith(`${BASE_URL}/search`, {
      params: { page: 1, limit: 16 },
    });
  });

  it("getPaginated returns properties with the total count", async () => {
    axiosMock.get.mockResolvedValue({
      data: [mockProperty],
      headers: { "x-total-count": "9" },
    });
    const result = await propertiesService.getPaginated(2, 9);
    expect(axiosMock.get).toHaveBeenCalledWith(BASE_URL, {
      params: { page: 2, limit: 9 },
    });
    expect(result).toEqual({ properties: [mockProperty], total: 9 });
  });
});

describe("propertiesService admin operations", () => {
  const token = "my-webtoken";

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("webtoken", JSON.stringify(token));
  });

  it("addProperty sends multipart data with Bearer token", async () => {
    const formData = new FormData();
    axiosMock.post.mockResolvedValue({ data: mockProperty });

    const result = await propertiesService.addProperty(formData);

    expect(axiosMock.post).toHaveBeenCalledWith(BASE_URL, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(result).toEqual(mockProperty);
  });

  it("addProperty throws when no token is stored", async () => {
    localStorage.removeItem("webtoken");
    await expect(propertiesService.addProperty(new FormData())).rejects.toThrow(
      "Token is invalid",
    );
  });

  it("removeProperty sends DELETE with Bearer token", async () => {
    axiosMock.delete.mockResolvedValue({ data: { message: "deleted" } });

    const result = await propertiesService.removeProperty("abc123");

    expect(axiosMock.delete).toHaveBeenCalledWith(`${BASE_URL}/abc123`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(result).toEqual({ message: "deleted" });
  });

  it("updateProperty sends PUT with Bearer token", async () => {
    const formData = new FormData();
    axiosMock.put.mockResolvedValue({ data: mockProperty });

    const result = await propertiesService.updateProperty("abc123", formData);

    expect(axiosMock.put).toHaveBeenCalledWith(`${BASE_URL}/abc123`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(result).toEqual(mockProperty);
  });

  it("removeProperty throws when no token is stored", async () => {
    localStorage.removeItem("webtoken");
    await expect(
      propertiesService.removeProperty("abc123"),
    ).rejects.toThrow("Token is invalid");
  });
});