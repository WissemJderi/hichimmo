import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import LoginPage from "./LoginPage";
import authService from "../../services/authService";

vi.mock("../../services/authService", () => ({
  default: { login: vi.fn() },
}));

const renderLogin = (initialPath = "/admin/login") =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<p>Dashboard page</p>} />
      </Routes>
    </MemoryRouter>,
  );

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("asks for a username when submitted empty", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    expect(
      await screen.findByText("Veuillez saisir votre nom d’utilisateur."),
    ).toBeInTheDocument();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it("asks for a password when only the username is filled", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/Nom d’utilisateur/), "admin");
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    expect(
      await screen.findByText("Veuillez saisir votre mot de passe."),
    ).toBeInTheDocument();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it("stores the token and navigates to the dashboard on success", async () => {
    const user = userEvent.setup();
    vi.mocked(authService.login).mockResolvedValue({ token: "jwt-123" });
    renderLogin();

    await user.type(screen.getByLabelText(/Nom d’utilisateur/), "admin");
    await user.type(screen.getByLabelText(/Mot de passe/), "secret");
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    expect(await screen.findByText("Dashboard page")).toBeInTheDocument();
    expect(authService.login).toHaveBeenCalledWith("admin", "secret");
    expect(localStorage.getItem("webtoken")).toBe(JSON.stringify("jwt-123"));
  });

  it("shows an error when credentials are rejected", async () => {
    const user = userEvent.setup();
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    vi.mocked(authService.login).mockRejectedValue(new Error("401"));
    renderLogin();

    await user.type(screen.getByLabelText(/Nom d’utilisateur/), "admin");
    await user.type(screen.getByLabelText(/Mot de passe/), "wrong");
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    expect(
      await screen.findByText("Nom d’utilisateur ou mot de passe incorrect."),
    ).toBeInTheDocument();
    expect(localStorage.getItem("webtoken")).toBeNull();
    logSpy.mockRestore();
  });
});
