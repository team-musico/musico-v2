import { NextRequest, NextResponse } from "next/server";
import type { LegacyUserRow } from "@/entities/legacy/model/legacy-user-row";
import { generateAccessToken } from "@/features/auth/server/generate-access-token";
import { generateRefreshToken } from "@/features/auth/server/generate-refresh-token";
import { setLegacyAuthCookies } from "@/features/auth/server/set-legacy-auth-cookies";
import { verifyRefreshToken } from "@/features/auth/server/verify-refresh-token";
import { getSupabaseAdmin } from "@/lib/server/supabase-admin";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    refreshToken?: string;
  } | null;
  const refreshToken = body?.refreshToken;

  if (!refreshToken) {
    return NextResponse.json({ message: "NO_TOKEN" }, { status: 401 });
  }

  try {
    const userId = await verifyRefreshToken(refreshToken);
    const supabase = getSupabaseAdmin();
    const { data: user } = await supabase
      .from("musico_users")
      .select("*")
      .eq("id", userId)
      .eq("refresh_token", refreshToken)
      .maybeSingle<LegacyUserRow>();

    if (!user) {
      return NextResponse.json(
        { message: "INVALID_REFRESHTOKEN" },
        { status: 401 },
      );
    }

    const newAccessToken = await generateAccessToken(user.id);
    const newRefreshToken = await generateRefreshToken(user.id);

    await supabase
      .from("musico_users")
      .update({ refresh_token: newRefreshToken })
      .eq("id", user.id);

    const response = NextResponse.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
    setLegacyAuthCookies(response, newAccessToken, newRefreshToken);

    return response;
  } catch {
    return NextResponse.json({ message: "REFRESHTOKEN_EXPIRED" }, { status: 401 });
  }
}
