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
  const originalQueue = user.original_queue ?? [];
  const duplicateIndex = queue.findIndex((item) => item.trackId === song.trackId);
  const nextQueue = duplicateIndex >= 0 ? queue : [...queue, song];
  const nextOriginalQueue =
    duplicateIndex >= 0 ? originalQueue : [...originalQueue, song];
  const currentSong =
    duplicateIndex >= 0 ? duplicateIndex : Math.max(nextQueue.length - 1, 0);

  const { data, error: dbError } = await getSupabaseAdmin()
    .from("musico_users")
    .update({
      queue: nextQueue,
      original_queue: nextOriginalQueue,
      current_song: currentSong,
    })
    .eq("id", user.id)
    .select("*")
    .single();

  if (dbError || !data) {
    return NextResponse.json({ message: "SERVER_ERROR" }, { status: 500 });
  }

  return NextResponse.json(serializeUser(data));
}

export async function DELETE(request: NextRequest) {
  const { user, error } = await getRequiredLegacyUser(request);
  if (error) return error;

  const trackId = Number(request.nextUrl.searchParams.get("trackId"));
  if (!Number.isFinite(trackId)) {
    return NextResponse.json({ message: "TRACK_ID_REQUIRED" }, { status: 400 });
  }

  const queue = user.queue ?? [];
  const targetIndex = queue.findIndex((item) => item.trackId === trackId);
  const nextQueue = queue.filter((item) => item.trackId !== trackId);
  let currentSong = user.current_song;

  if (currentSong !== 0 && targetIndex <= currentSong) {
    currentSong -= 1;
  }
  currentSong = Math.max(0, Math.min(currentSong, nextQueue.length - 1));

  const { data, error: dbError } = await getSupabaseAdmin()
    .from("musico_users")
    .update({
      queue: nextQueue,
      original_queue: nextQueue,
      current_song: currentSong,
    })
    .eq("id", user.id)
    .select("*")
    .single();

  if (dbError || !data) {
    return NextResponse.json({ message: "SERVER_ERROR" }, { status: 500 });
  }

  return NextResponse.json(serializeUser(data));
}
