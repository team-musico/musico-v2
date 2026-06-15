import type { LegacyUserRow } from "@/entities/legacy/model/legacy-user-row";

export const serializeUser = (row: LegacyUserRow) => ({
    _id: row.id,
    id: row.id,
    username: row.username,
    role: row.role ?? "user",
    queue: row.queue ?? [],
    originalQueue: row.original_queue ?? [],
    currentSong: row.current_song ?? 0,
    isShuffle: row.is_shuffle ?? false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
