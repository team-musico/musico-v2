import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import type { LegacyUserRow } from "@/entities/legacy/model/legacy-user-row";
import { jwtSecrets } from "@/features/auth/server/jwt-secrets";
import { getSupabaseAdmin } from "@/lib/server/supabase-admin";

export const getRequiredLegacyUser = async (request: NextRequest) => {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) {
    return {
      error: NextResponse.json({ message: "NO_TOKEN" }, { status: 401 }),
      user: null,
    };
  }

  try {
    const { payload } = await jwtVerify(token, jwtSecrets.access);
    const userId = String(payload.id);
    const { data, error } = await getSupabaseAdmin()
      .from("musico_users")
      .select("*")
      .eq("id", userId)
      .single<LegacyUserRow>();

    if (error || !data) {
      return {
        error: NextResponse.json({ message: "INVALID_TOKEN" }, { status: 401 }),
        user: null,
      };
    }

    return { error: null, user: data };
  } catch {
    return {
      error: NextResponse.json({ message: "INVALID_TOKEN" }, { status: 401 }),
      user: null,
    };
  }
};
