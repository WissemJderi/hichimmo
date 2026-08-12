import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import PropertiesTable from "./PropertiesTable";
import { Location, Property, PropertyType } from "../../../types/Property";

const property: Property = {
  _id: "abc123",
  title: "Studio à Sahloul",
  ref: "STU-1",
  description: "Petit studio bien situé",
  price: 45000,
  propertyType: PropertyType.Appartement,
  location: Location.Sahloul,
  area: 35,
  status: "rent",
  images: ["https://example.com/studio.jpg"],
  createdAt: "2026-02-06T12:00:00.000Z",
};

describe("PropertiesTable", () => {
  it("renders the property, formatted date and price", () => {
    render(
      <MemoryRouter>
        <PropertiesTable
          properties={[property]}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(screen.getAllByText("Studio à Sahloul").length).toBeGreaterThan(0);
    expect(screen.getAllByText("6 février 2026").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/45\s000 DT/).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Location").length).toBeGreaterThan(0);
  });

  it("calls onEdit and onDelete when buttons are clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <MemoryRouter>
        <PropertiesTable
          properties={[property]}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </MemoryRouter>,
    );

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]);
    expect(onEdit).toHaveBeenCalledWith(property);

    await user.click(buttons[1]);
    expect(onDelete).toHaveBeenCalledWith("abc123", "Studio à Sahloul");
  });
});