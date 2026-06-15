import { jsonHeaders } from "@/shared/api/json-headers";

export const withAuthHeaders = (token: string, headers?: HeadersInit): HeadersInit => ({
  ...jsonHeaders,
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
  ...headers,
});
