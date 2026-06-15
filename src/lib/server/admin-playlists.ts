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

export const getAdminPlaylists = async () => {
  const { data, error } = await getSupabaseAdmin()
    .from("musico_admin_playlists")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<AdminPlaylistRow[]>();

  if (error) {
    if (isMissingAdminPlaylistTable(error)) {
      console.warn("[admin-playlists] musico_admin_playlists table is missing. Apply supabase/migrations/0004_repair_admin_playlist_schema.sql.");
      return [];
    }

    throw error;
  }

  return (data ?? []).map(serializeAdminPlaylist);
};
