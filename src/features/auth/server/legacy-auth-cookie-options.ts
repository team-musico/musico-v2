const isProduction = process.env.NODE_ENV === "production";

export const legacyAuthCookieOptions = {
  access: {
    httpOnly: true,
    maxAge: 60 * 15,
    path: "/",
    sameSite: "lax",
    secure: isProduction,
  },
  refresh: {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure: isProduction,
  },
} as const;
