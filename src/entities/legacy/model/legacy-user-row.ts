import type { LegacyMusicData } from "@/entities/legacy/model/legacy-music-data";

export type LegacyUserRow = {
  id: string;
  username: string;
  password_hash: string;
  role: "user" | "admin";
  queue: LegacyMusicData[];
  original_queue: LegacyMusicData[];
  current_song: number;
  is_shuffle: boolean;
  refresh_token: string | null;
  created_at: string;
  updated_at: string;
};
