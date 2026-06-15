import { NextRequest, NextResponse } from "next/server";
import { serializeUser } from "@/entities/legacy/lib/serialize-user";
import type { LegacyMusicData } from "@/entities/legacy/model/legacy-music-data";
import { getRequiredLegacyUser } from "@/features/auth/server/get-required-legacy-user";
import { getSupabaseAdmin } from "@/lib/server/supabase-admin";

export async function POST(request: NextRequest) {
  const { user, error } = await getRequiredLegacyUser(request);
  if (error) return error;

  const song = (await request.json().catch(() => null)) as LegacyMusicData | null;
  if (!song?.trackId) {
    return NextResponse.json({ message: "BAD_REQUEST" }, { status: 400 });
  }

  const queue = user.queue ?? [];
  const duplicated = queue.some((item) => item.trackId === song.trackId);
  if (duplicated) {
    return NextResponse.json({ message: "SONG_DUPLICATED" }, { status: 409 });
  }

  const { data, error: dbError } = await getSupabaseAdmin()
    .from("musico_users")
    .update({
      queue: [...queue, song],
      original_queue: [...(user.original_queue ?? []), song],
    })
    .eq("id", user.id)
    .select("*")
    .single();

  if (dbError || !data) {
    return NextResponse.json({ message: "SERVER_ERROR" }, { status: 500 });
  }

  return NextResponse.json(serializeUser(data));
}
