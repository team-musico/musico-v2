import { NextRequest, NextResponse } from "next/server";
import { serializeAdminPlaylist } from "@/entities/legacy/lib/serialize-admin-playlist";
import type { AdminPlaylistRow } from "@/entities/legacy/model/admin-playlist-row";
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
  console.error("[admin-playlists]", error);
  return NextResponse.json({ message: "SERVER_ERROR" }, { status: 500 });
}

export async function GET(request: NextRequest) {
  const { error: authError } = await getRequiredAdminUser(request);
  if (authError) return authError;

  const { data, error } = await getSupabaseAdmin()
    .from("musico_admin_playlists")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<AdminPlaylistRow[]>();

  if (error) {
    if (isMissingAdminPlaylistTable(error)) {
      console.warn("[admin-playlists] musico_admin_playlists table is missing. Apply supabase/migrations/0002_admin_playlists.sql.");
      return NextResponse.json([]);
    }

    return serverError(error);
  }

  return NextResponse.json((data ?? []).map(serializeAdminPlaylist));
}

export async function POST(request: NextRequest) {
  const { error: authError } = await getRequiredAdminUser(request);
  if (authError) return authError;

  const body = (await request.json().catch(() => null)) as {
    title?: string;
    description?: string;
  } | null;
  const title = body?.title?.trim();

  if (!title) {
    return NextResponse.json({ message: "TITLE_REQUIRED" }, { status: 400 });
  }

  const { data, error } = await getSupabaseAdmin()
    .from("musico_admin_playlists")
    .insert({ title, description: body?.description?.trim() || null })
    .select("*")
    .single<AdminPlaylistRow>();

  if (error || !data) {
    if (error && isMissingAdminPlaylistTable(error)) {
      return NextResponse.json({ message: "ADMIN_PLAYLIST_MIGRATION_REQUIRED" }, { status: 409 });
    }

    return serverError(error);
  }

  return NextResponse.json(serializeAdminPlaylist(data), { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { error: authError } = await getRequiredAdminUser(request);
  if (authError) return authError;

  const playlistId = request.nextUrl.searchParams.get("playlistId");
  if (!playlistId) {
    return NextResponse.json({ message: "PLAYLIST_ID_REQUIRED" }, { status: 400 });
  }

  const { error } = await getSupabaseAdmin()
    .from("musico_admin_playlists")
    .delete()
    .eq("id", playlistId);

  if (error) {
    if (isMissingAdminPlaylistTable(error)) {
      return NextResponse.json({ message: "ADMIN_PLAYLIST_MIGRATION_REQUIRED" }, { status: 409 });
    }

    return serverError(error);
  }

  return new NextResponse(null, { status: 204 });
}
