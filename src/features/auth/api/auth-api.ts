import type { LegacyUser } from "@/entities/user/model/legacy-user";
import { jsonHeaders } from "@/shared/api/json-headers";
import { withAuthHeaders } from "@/shared/api/with-auth-headers";

export const authApi = {
  request: (path: string, init?: RequestInit, token = "") =>
    fetch(path, {
      ...init,
      headers: withAuthHeaders(token, init?.headers),
    }),
  me: async (token: string) => {
    const response = await fetch("/api/auth/me", {
      headers: withAuthHeaders(token),
    });

    return {
      response,
      user: response.ok ? ((await response.json()) as LegacyUser) : null,
    };
  },
  login: async (username: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({ username, password }),
    });
    const payload = await response.json();

    return { response, payload };
  },
  signup: async (username: string, password: string) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({ username, password }),
    });
    const payload = await response.json();

    return { response, payload };
  },
};
