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

const makeForm = (overrides: Partial<FormDataState>): FormDataState => ({
  ...validForm,
  ...overrides,
});

const errorFields = (form: FormDataState) =>
  validatePropertyForm(form).map((e) => e.field);

describe("validatePropertyForm", () => {
  it("accepts a valid form", () => {
    expect(validatePropertyForm(validForm)).toEqual([]);
    expect(isFormValid(validForm)).toBe(true);
  });

  it("requires title, ref, description, type, location, status", () => {
    const errors = validatePropertyForm(
      makeForm({
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
    expect(isFormValid(makeForm({ title: "" }))).toBe(false);
  });

  it("requires price and area", () => {
    expect(
      errorFields(makeForm({ price: undefined as never, area: undefined as never })),
    ).toEqual(expect.arrayContaining(["price", "area"]));
  });

  it("rejects non-positive price and area", () => {
    expect(errorFields(makeForm({ price: 0, area: -5 }))).toEqual(
      expect.arrayContaining(["price", "area"]),
    );
  });

  it("rejects non-finite price and area", () => {
    expect(errorFields(makeForm({ price: NaN, area: Infinity }))).toEqual(
      expect.arrayContaining(["price", "area"]),
    );
  });

  it("rejects null price and area", () => {
    expect(
      errorFields(makeForm({ price: null as never, area: null as never })),
    ).toEqual(expect.arrayContaining(["price", "area"]));
  });

  it("requires title and ref when undefined", () => {
    expect(
      errorFields(makeForm({ title: undefined as never, ref: undefined as never })),
    ).toEqual(expect.arrayContaining(["title", "ref"]));
  });

  it("allows zero bedrooms, bathrooms, floor", () => {
    expect(
      validatePropertyForm(makeForm({ bedrooms: 0, bathrooms: 0, floor: 0 })),
    ).toEqual([]);
  });

  it("rejects negative or decimal bedrooms, bathrooms, floor", () => {
    const errors = validatePropertyForm(
      makeForm({ bedrooms: -1, bathrooms: 1.5, floor: 2.5 }),
    );
    expect(errors.map((e) => e.field).sort()).toEqual(
      ["bathrooms", "bedrooms", "floor"].sort(),
    );
  });

  it("allows missing optional bedrooms, bathrooms, floor", () => {
    expect(validatePropertyForm(validForm)).toEqual([]);
  });
});
