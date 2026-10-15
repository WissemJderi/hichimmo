import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { ProtectedRoute } from "./ProtectedRoute";

const renderProtected = () =>
  render(
    <MemoryRouter initialEntries={["/admin/dashboard"]}>
      <Routes>
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <p>Dashboard content</p>
            </ProtectedRoute>
          }
        />
        <Route path="/admin/login" element={<p>Login page</p>} />
      </Routes>
    </MemoryRouter>,
  );

describe("ProtectedRoute", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("redirects to login when no token is stored", () => {
    renderProtected();

    expect(screen.getByText("Login page")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard content")).not.toBeInTheDocument();
  });

  it("renders children when a token is stored", () => {
    localStorage.setItem("webtoken", JSON.stringify("my-webtoken"));
    renderProtected();

    expect(screen.getByText("Dashboard content")).toBeInTheDocument();
    expect(screen.queryByText("Login page")).not.toBeInTheDocument();
  });
});
