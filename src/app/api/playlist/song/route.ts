import { NextRequest, NextResponse } from "next/server";
import { addSongToPlaylist } from "@/app/api/playlist/route";
import type { LegacyMusicData } from "@/entities/legacy/model/legacy-music-data";
import type { LegacyPlaylistRow } from "@/entities/legacy/model/legacy-playlist-row";
import { getRequiredLegacyUser } from "@/features/auth/server/get-required-legacy-user";
import { getSupabaseAdmin } from "@/lib/server/supabase-admin";

export async function POST(request: NextRequest) {
  const playlistId = request.nextUrl.searchParams.get("playlistId");
  const song = (await request.json().catch(() => null)) as LegacyMusicData | null;

  if (!playlistId || !song?.trackId) {
    return NextResponse.json({ message: "BAD_REQUEST" }, { status: 400 });
  }

  return addSongToPlaylist(request, song, playlistId);
}

export async function DELETE(request: NextRequest) {
  const { user, error } = await getRequiredLegacyUser(request);
  if (error) return error;

  const playlistId = request.nextUrl.searchParams.get("playlistId");
  const trackId = Number(request.nextUrl.searchParams.get("trackId"));

  if (!playlistId || !Number.isFinite(trackId)) {
    return NextResponse.json({ message: "BAD_REQUEST" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: playlist, error: readError } = await supabase
    .from("musico_playlists")
    .select("*")
    .eq("id", playlistId)
    .eq("author", user.id)
    .single<LegacyPlaylistRow>();

  if (readError || !playlist) {
    return NextResponse.json({ message: "PLAYLIST_NOT_FOUND" }, { status: 404 });
  }

  const songs = (playlist.songs ?? []).filter((item) => item.trackId !== trackId);
  const { error: updateError } = await supabase
    .from("musico_playlists")
    .update({ songs })
    .eq("id", playlist.id);

  if (updateError) {
    return NextResponse.json({ message: "SERVER_ERROR" }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
