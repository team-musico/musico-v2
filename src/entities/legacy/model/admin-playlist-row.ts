import type { LegacyMusicData } from "@/entities/legacy/model/legacy-music-data";

export type AdminPlaylistRow = {
  id: string;
  title: string;
  description: string | null;
  songs: LegacyMusicData[];
  created_at: string;
  updated_at: string;
};
