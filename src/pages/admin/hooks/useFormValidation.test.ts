import { describe, expect, it } from "vitest";
import {
  isFormValid,
  validatePropertyForm,
} from "./useFormValidation";
import type { FormDataState } from "./usePropertyForm";
import { Location, PropertyType } from "../../../types/Property";

const validForm: FormDataState = {
  title: "Duplex à Sousse",
  ref: "ABC-1",
  description: "Bien spacieux",
  price: 120000,
  propertyType: PropertyType.Appartement,
  location: Location.Sousse,
  area: 90,
  status: "sale",
  parking: false,
};

const fields = (overrides: Partial<FormDataState>): FormDataState => ({
  ...validForm,
  ...overrides,
});

describe("validatePropertyForm", () => {
  it("accepts a valid form", () => {
    expect(validatePropertyForm(validForm)).toEqual([]);
    expect(isFormValid(validForm)).toBe(true);
  });

  it("requires title, ref, description, type, location, status", () => {
    const errors = validatePropertyForm(
      fields({
        title: "  ",
        ref: "",
        description: "",
        propertyType: "" as never,
        location: "" as never,
        status: "" as never,
      }),
    );
    expect(errors.map((e) => e.field).sort()).toEqual(
      ["description", "location", "propertyType", "ref", "status", "title"].sort(),
    );
    expect(isFormValid(fields({ title: "" }))).toBe(false);
  });

  it("requires price and area", () => {
    expect(
      validatePropertyForm(
        fields({ price: undefined as never, area: undefined as never }),
      ).map((e) => e.field),
    ).toEqual(expect.arrayContaining(["price", "area"]));
  });

  it("rejects non-positive price and area", () => {
    expect(
      validatePropertyForm(fields({ price: 0, area: -5 })).map((e) => e.field),
    ).toEqual(expect.arrayContaining(["price", "area"]));
  });

  it("rejects non-finite price and area", () => {
    const errors = validatePropertyForm(fields({ price: NaN, area: Infinity }));
    expect(errors.map((e) => e.field)).toEqual(
      expect.arrayContaining(["price", "area"]),
    );
  });

  it("rejects null price and area", () => {
    const errors = validatePropertyForm(
      fields({ price: null as never, area: null as never }),
    ).map((e) => e.field);
    expect(errors).toEqual(expect.arrayContaining(["price", "area"]));
  });

  it("requires title and ref when undefined", () => {
    const errors = validatePropertyForm(
      fields({ title: undefined as never, ref: undefined as never }),
    ).map((e) => e.field);
    expect(errors).toEqual(expect.arrayContaining(["title", "ref"]));
  });

  it("allows zero bedrooms, bathrooms, floor", () => {
    expect(
      validatePropertyForm(fields({ bedrooms: 0, bathrooms: 0, floor: 0 })),
    ).toEqual([]);
  });

  it("rejects negative or decimal bedrooms, bathrooms, floor", () => {
    const errors = validatePropertyForm(
      fields({ bedrooms: -1, bathrooms: 1.5, floor: 2.5 }),
    );
    expect(errors.map((e) => e.field).sort()).toEqual(
      ["bathrooms", "bedrooms", "floor"].sort(),
    );
  });

  it("allows missing optional bedrooms, bathrooms, floor", () => {
    expect(validatePropertyForm(validForm)).toEqual([]);
  });
});
