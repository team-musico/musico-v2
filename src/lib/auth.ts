import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: undefined,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret:
    process.env.BETTER_AUTH_SECRET ??
    "musico-v2-development-secret-change-me-before-production",
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"],
});
