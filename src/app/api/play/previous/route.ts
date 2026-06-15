import { NextRequest, NextResponse } from "next/server";
import { serializeUser } from "@/entities/legacy/lib/serialize-user";
import { getRequiredLegacyUser } from "@/features/auth/server/get-required-legacy-user";
import { getSupabaseAdmin } from "@/lib/server/supabase-admin";

export async function GET(request: NextRequest) {
  const { user, error } = await getRequiredLegacyUser(request);
  if (error) return error;

  const currentSong = user.current_song > 0 ? user.current_song - 1 : 0;
  const { data, error: dbError } = await getSupabaseAdmin()
    .from("musico_users")
    .update({ current_song: currentSong })
    .eq("id", user.id)
    .select("*")
    .single();

  if (dbError || !data) {
    return NextResponse.json({ message: "SERVER_ERROR" }, { status: 500 });
  }

  return NextResponse.json(serializeUser(data));
}
