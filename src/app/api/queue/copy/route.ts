import { NextRequest, NextResponse } from "next/server";
import { serializeUser } from "@/entities/legacy/lib/serialize-user";
import type { LegacyPlaylistRow } from "@/entities/legacy/model/legacy-playlist-row";
import { getRequiredLegacyUser } from "@/features/auth/server/get-required-legacy-user";
import { getSupabaseAdmin } from "@/lib/server/supabase-admin";

export async function POST(request: NextRequest) {
  const { user, error } = await getRequiredLegacyUser(request);
  if (error) return error;

  const playlistId = request.nextUrl.searchParams.get("playlistId");
  if (!playlistId) {
    return NextResponse.json({ message: "PLAYLIST_ID_REQUIRED" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: playlist } = await supabase
    .from("musico_playlists")
    .select("*")
    .eq("id", playlistId)
    .eq("author", user.id)
    .single<LegacyPlaylistRow>();

  if (!playlist) {
    return NextResponse.json({ message: "PLAYLIST_NOT_FOUND" }, { status: 404 });
  }

  const songs = playlist.songs ?? [];
  const { data, error: dbError } = await supabase
    .from("musico_users")
    .update({
      queue: songs,
      original_queue: songs,
      current_song: 0,
    })
    .eq("id", user.id)
    .select("*")
    .single();

  if (dbError || !data) {
    return NextResponse.json({ message: "SERVER_ERROR" }, { status: 500 });
  }

  return NextResponse.json(serializeUser(data));
}
