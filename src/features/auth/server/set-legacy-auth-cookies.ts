import type { NextResponse } from "next/server";
import { legacyAuthCookieOptions } from "@/features/auth/server/legacy-auth-cookie-options";
import { legacyAuthCookies } from "@/features/auth/server/legacy-auth-cookies";

export const setLegacyAuthCookies = (
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
) => {
  response.cookies.set(
    legacyAuthCookies.access,
    accessToken,
    legacyAuthCookieOptions.access,
  );
  response.cookies.set(
    legacyAuthCookies.refresh,
    refreshToken,
    legacyAuthCookieOptions.refresh,
  );
};
