export const jwtSecrets = {
  access: new TextEncoder().encode(
    process.env.ACCESS_TOKEN_SECRET ??
      process.env.BETTER_AUTH_SECRET ??
      "musico-v2-development-access-secret",
  ),
  refresh: new TextEncoder().encode(
    process.env.REFRESH_TOKEN_SECRET ??
      process.env.BETTER_AUTH_SECRET ??
      "musico-v2-development-refresh-secret",
  ),
};
