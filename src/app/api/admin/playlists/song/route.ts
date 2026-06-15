import { NextRequest, NextResponse } from "next/server";
import type { AdminPlaylistRow } from "@/entities/legacy/model/admin-playlist-row";
import type { LegacyMusicData } from "@/entities/legacy/model/legacy-music-data";
import { getRequiredAdminUser } from "@/features/auth/server/get-required-admin-user";
import { getSupabaseAdmin } from "@/lib/server/supabase-admin";

function isMissingAdminPlaylistTable(error: { code?: string; message?: string }) {
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    error.message?.includes("musico_admin_playlists") ||
    error.message?.includes("schema cache")
  );
}

function serverError(error: unknown) {
  console.error("[admin-playlists-song]", error);
  return NextResponse.json({ message: "SERVER_ERROR" }, { status: 500 });
}

export async function POST(request: NextRequest) {
  const { error: authError } = await getRequiredAdminUser(request);
  if (authError) return authError;

  const playlistId = request.nextUrl.searchParams.get("playlistId");
  const song = (await request.json().catch(() => null)) as LegacyMusicData | null;

  if (!playlistId || !song?.trackId) {
    return NextResponse.json({ message: "BAD_REQUEST" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: playlist, error: readError } = await supabase
    .from("musico_admin_playlists")
    .select("*")
    .eq("id", playlistId)
    .single<AdminPlaylistRow>();

  if (readError || !playlist) {
    if (readError && isMissingAdminPlaylistTable(readError)) {
      return NextResponse.json({ message: "ADMIN_PLAYLIST_MIGRATION_REQUIRED" }, { status: 409 });
    }

    return NextResponse.json({ message: "PLAYLIST_NOT_FOUND" }, { status: 404 });
  }

  const songs = playlist.songs ?? [];
  const duplicated = songs.some((item) => item.trackId === song.trackId);
  if (duplicated) {
    return NextResponse.json({ message: "SONG_DUPLICATED" }, { status: 409 });
  }

  const { error } = await supabase
    .from("musico_admin_playlists")
    .update({ songs: [...songs, song] })
    .eq("id", playlistId);

  if (error) {
    if (isMissingAdminPlaylistTable(error)) {
      return NextResponse.json({ message: "ADMIN_PLAYLIST_MIGRATION_REQUIRED" }, { status: 409 });
    }

    return serverError(error);
  }

  return NextResponse.json({ message: "SONG_ADDED" }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { error: authError } = await getRequiredAdminUser(request);
  if (authError) return authError;

  const playlistId = request.nextUrl.searchParams.get("playlistId");
  const trackId = Number(request.nextUrl.searchParams.get("trackId"));

  if (!playlistId || !Number.isFinite(trackId)) {
    return NextResponse.json({ message: "BAD_REQUEST" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: playlist, error: readError } = await supabase
    .from("musico_admin_playlists")
    .select("*")
    .eq("id", playlistId)
    .single<AdminPlaylistRow>();

  if (readError || !playlist) {
    if (readError && isMissingAdminPlaylistTable(readError)) {
      return NextResponse.json({ message: "ADMIN_PLAYLIST_MIGRATION_REQUIRED" }, { status: 409 });
    }

    return NextResponse.json({ message: "PLAYLIST_NOT_FOUND" }, { status: 404 });
  }

  const songs = (playlist.songs ?? []).filter((item) => item.trackId !== trackId);
  const { error } = await supabase
    .from("musico_admin_playlists")
    .update({ songs })
    .eq("id", playlistId);

  if (error) {
    if (isMissingAdminPlaylistTable(error)) {
      return NextResponse.json({ message: "ADMIN_PLAYLIST_MIGRATION_REQUIRED" }, { status: 409 });
    }

    return serverError(error);
  }

  return new NextResponse(null, { status: 204 });
}
