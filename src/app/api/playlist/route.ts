import { NextRequest, NextResponse } from "next/server";
import { serializePlaylist } from "@/entities/legacy/lib/serialize-playlist";
import type { LegacyMusicData } from "@/entities/legacy/model/legacy-music-data";
import type { LegacyPlaylistRow } from "@/entities/legacy/model/legacy-playlist-row";
import { getRequiredLegacyUser } from "@/features/auth/server/get-required-legacy-user";
import { getSupabaseAdmin } from "@/lib/server/supabase-admin";

export async function GET(request: NextRequest) {
  const { user, error } = await getRequiredLegacyUser(request);
  if (error) return error;

  const playlistId = request.nextUrl.searchParams.get("playlistId");
  const supabase = getSupabaseAdmin();

  if (playlistId) {
    const { data, error: dbError } = await supabase
      .from("musico_playlists")
      .select("*")
      .eq("id", playlistId)
      .eq("author", user.id)
      .single<LegacyPlaylistRow>();

    if (dbError || !data) {
      return NextResponse.json({ message: "PLAYLIST_NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json(serializePlaylist(data));
  }

  const { data, error: dbError } = await supabase
    .from("musico_playlists")
    .select("*")
    .eq("author", user.id)
    .order("created_at", { ascending: false })
    .returns<LegacyPlaylistRow[]>();

  if (dbError) {
    return NextResponse.json({ message: "SERVER_ERROR" }, { status: 500 });
  }

  return NextResponse.json((data ?? []).map(serializePlaylist));
}

export async function POST(request: NextRequest) {
  const { user, error } = await getRequiredLegacyUser(request);
  if (error) return error;

  const body = (await request.json().catch(() => null)) as {
    title?: string;
  } | null;
  const title = body?.title?.trim();

  if (!title) {
    return NextResponse.json({ message: "TITLE_REQUIRED" }, { status: 400 });
  }

  const { error: dbError } = await getSupabaseAdmin()
    .from("musico_playlists")
    .insert({ title, author: user.id });

  if (dbError) {
    return NextResponse.json({ message: "SERVER_ERROR" }, { status: 500 });
  }

  return NextResponse.json(
    { message: "PLAYLIST_CREATED_SUCCESSFULLY" },
    { status: 201 },
  );
}

export async function PATCH(request: NextRequest) {
  const { user, error } = await getRequiredLegacyUser(request);
  if (error) return error;

  const playlistId = request.nextUrl.searchParams.get("playlistId");
  const body = (await request.json().catch(() => null)) as {
    title?: string;
  } | null;
  const title = body?.title?.trim();

  if (!playlistId || !title) {
    return NextResponse.json({ message: "BAD_REQUEST" }, { status: 400 });
  }

  const { data, error: dbError } = await getSupabaseAdmin()
    .from("musico_playlists")
    .update({ title })
    .eq("id", playlistId)
    .eq("author", user.id)
    .select("*")
    .single<LegacyPlaylistRow>();

  if (dbError || !data) {
    return NextResponse.json({ message: "PLAYLIST_NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json(serializePlaylist(data));
}

export async function DELETE(request: NextRequest) {
  const { user, error } = await getRequiredLegacyUser(request);
  if (error) return error;

  const playlistId = request.nextUrl.searchParams.get("playlistId");
  if (!playlistId) {
    return NextResponse.json({ message: "PLAYLIST_ID_REQUIRED" }, { status: 400 });
  }

  const { error: dbError } = await getSupabaseAdmin()
    .from("musico_playlists")
    .delete()
    .eq("id", playlistId)
    .eq("author", user.id);

  if (dbError) {
    return NextResponse.json({ message: "SERVER_ERROR" }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}

export async function addSongToPlaylist(
  request: NextRequest,
  song: LegacyMusicData,
  playlistId: string,
) {
  const { user, error } = await getRequiredLegacyUser(request);
  if (error) return error;

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

  const songs = playlist.songs ?? [];
  const duplicated = songs.some((item) => item.trackId === song.trackId);
  if (duplicated) {
    return NextResponse.json({ message: "SONG_DUPLICATED" }, { status: 409 });
  }

  const { error: updateError } = await supabase
    .from("musico_playlists")
    .update({ songs: [...songs, song] })
    .eq("id", playlist.id);

  if (updateError) {
    return NextResponse.json({ message: "SERVER_ERROR" }, { status: 500 });
  }

  return NextResponse.json(
    { message: "SUCCESSFULLY_ADDED_TO_PLAYLIST" },
    { status: 201 },
  );
}
