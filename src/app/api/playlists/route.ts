import { NextResponse } from "next/server";
import { serializeAdminPlaylist } from "@/entities/legacy/lib/serialize-admin-playlist";
import type { AdminPlaylistRow } from "@/entities/legacy/model/admin-playlist-row";
import { getSupabaseAdmin } from "@/lib/server/supabase-admin";

function isMissingAdminPlaylistTable(error: { code?: string; message?: string }) {
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    error.message?.includes("musico_admin_playlists") ||
    error.message?.includes("schema cache")
  );
}

export async function GET() {
  const { data, error } = await getSupabaseAdmin()
    .from("musico_admin_playlists")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<AdminPlaylistRow[]>();

  if (error) {
    if (isMissingAdminPlaylistTable(error)) {
      console.warn("[playlists] musico_admin_playlists table is missing. Apply supabase/migrations/0002_admin_playlists.sql.");
      return NextResponse.json([]);
    }

    console.error("[playlists]", error);
    return NextResponse.json({ message: "SERVER_ERROR" }, { status: 500 });
  }

  return NextResponse.json((data ?? []).map(serializeAdminPlaylist));
}
