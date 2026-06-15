import type { LegacyMusicData } from "@/entities/legacy/model/legacy-music-data";

export type LegacyPlaylistRow = {
  id: string;
  title: string;
  author: string;
  songs: LegacyMusicData[];
  created_at: string;
  updated_at: string;
};
