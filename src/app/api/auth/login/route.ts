import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import type { LegacyUserRow } from "@/entities/legacy/model/legacy-user-row";
import { generateAccessToken } from "@/features/auth/server/generate-access-token";
import { generateRefreshToken } from "@/features/auth/server/generate-refresh-token";
import { setLegacyAuthCookies } from "@/features/auth/server/set-legacy-auth-cookies";
import { getSupabaseAdmin } from "@/lib/server/supabase-admin";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    username?: string;
    password?: string;
  } | null;
  const username = body?.username?.trim();
  const password = body?.password;

  if (!username || !password) {
    return NextResponse.json({ message: "BAD_REQUEST" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: user } = await supabase
    .from("musico_users")
    .select("*")
    .eq("username", username)
    .maybeSingle<LegacyUserRow>();

  if (!user) {
    return NextResponse.json({ message: "USER_NOT_FOUND" }, { status: 404 });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
  }

  const accessToken = await generateAccessToken(user.id);
  const refreshToken = await generateRefreshToken(user.id);

  await supabase
    .from("musico_users")
    .update({ refresh_token: refreshToken })
    .eq("id", user.id);

  const response = NextResponse.json({ accessToken, refreshToken });
  setLegacyAuthCookies(response, accessToken, refreshToken);

  return response;
}
