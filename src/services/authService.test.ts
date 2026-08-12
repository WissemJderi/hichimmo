import { beforeEach, describe, expect, it, vi } from "vitest";

const { axiosMock } = vi.hoisted(() => ({
  axiosMock: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock("axios", () => ({ default: axiosMock }));

import authService from "./authService";

const AUTH_URL = "https://dahechimmo-backend.onrender.com/api/auth";

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("login posts username and password to /auth/login", async () => {
    axiosMock.post.mockResolvedValue({ data: { token: "jwt-token" } });

    const result = await authService.login("admin", "secret");

    expect(axiosMock.post).toHaveBeenCalledWith(`${AUTH_URL}/login`, {
      username: "admin",
      password: "secret",
    });
    expect(result).toEqual({ token: "jwt-token" });
  });

  it("getAll sends the token as a Bearer header", async () => {
    axiosMock.get.mockResolvedValue({ data: [{ id: 1 }] });

    const result = await authService.getAll("jwt-token");

    expect(axiosMock.get).toHaveBeenCalledWith(`${AUTH_URL}/properties`, {
      headers: { Authorization: "Bearer jwt-token" },
    });
    expect(result).toEqual([{ id: 1 }]);
  });
});