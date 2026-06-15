import type { AdminPlaylistRow } from "@/entities/legacy/model/admin-playlist-row";

export const serializeAdminPlaylist = (row: AdminPlaylistRow) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    songs: row.songs ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
