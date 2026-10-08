import { describe, expect, it } from "vitest";
import {
  createWhatsappUrl,
  formatDateObject,
  formatFloor,
  formatNumber,
  formatPrice,
  formatTitle,
  titleCase,
  optimizeImageUrl,
} from "./utils";

describe("formatNumber", () => {
  it("groups a phone number into 2-3-3 chunks", () => {
    expect(formatNumber("98622442")).toBe("98 622 442");
  });
});

describe("titleCase", () => {
  it("capitalizes the first letter", () => {
    expect(titleCase("akouda")).toBe("Akouda");
    expect(titleCase("Sousse")).toBe("Sousse");
  });
});

describe("formatTitle", () => {
  it("replaces underscores with spaces and title-cases the result", () => {
    expect(formatTitle("hammam_sousse")).toBe("Hammam sousse");
    expect(formatTitle("akouda")).toBe("Akouda");
  });
});

describe("formatPrice", () => {
  it("appends DT and groups thousands", () => {
    expect(formatPrice(100)).toBe("100 DT");
    expect(formatPrice(10000)).toMatch(/^10\s000 DT$/);
  });
});

describe("createWhatsappUrl", () => {
  it("builds a wa.me link with the ref, title, and encoded message", () => {
    const url = createWhatsappUrl("REF-42", "Bel appartement");
    expect(url.startsWith("https://wa.me/21698622442?text=")).toBe(true);
    expect(decodeURIComponent(url)).toContain("REF-42");
    expect(decodeURIComponent(url)).toContain("Bel appartement");
    expect(decodeURIComponent(url)).toContain("référence");
  });
});

describe("formatDateObject", () => {
  it("formats an ISO date as 'day month year' in French", () => {
    expect(formatDateObject("2026-02-06T12:00:00.000Z")).toBe("6 février 2026");
  });
});

describe("formatFloor", () => {
  it("formats ground floor, first floor, and other floors", () => {
    expect(formatFloor(0)).toBe("Rez-de-chaussée");
    expect(formatFloor(1)).toBe("1er étage");
    expect(formatFloor(3)).toBe("3e étage");
  });
});

describe("optimizeImageUrl", () => {
  it("returns original url if empty", () => {
    expect(optimizeImageUrl("")).toBe("");
  });

  it("optimizes cloudinary urls", () => {
    const url = "https://res.cloudinary.com/dbdwqn8na/image/upload/v123456/properties/img.jpg";
    const result = optimizeImageUrl(url, { width: 800, height: 600 });
    expect(result).toContain("q_auto:best");
    expect(result).toContain("f_auto");
    expect(result).toContain("w_800");
    expect(result).toContain("h_600,c_fill");
  });

  it("returns original url for non-cloudinary", () => {
    const url = "https://example.com/image.jpg";
    expect(optimizeImageUrl(url, { width: 800 })).toBe(url);
  });
});
