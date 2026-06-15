import { NextRequest, NextResponse } from "next/server";
import { serializeUser } from "@/entities/legacy/lib/serialize-user";
import { getRequiredLegacyUser } from "@/features/auth/server/get-required-legacy-user";

export async function GET(request: NextRequest) {
  const { user, error } = await getRequiredLegacyUser(request);
  if (error) return error;

  return NextResponse.json(serializeUser(user));
}
