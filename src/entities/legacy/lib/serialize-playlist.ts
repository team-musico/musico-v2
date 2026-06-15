import type { LegacyPlaylistRow } from "@/entities/legacy/model/legacy-playlist-row";

export const serializePlaylist = (row: LegacyPlaylistRow) => ({
    id: row.id,
    title: row.title,
    author: row.author,
    songs: row.songs ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
