import type { LegacyArtist } from "@/entities/legacy/model/legacy-artist";

export type LegacyMusicData = {
  artist: LegacyArtist[];
  title: string;
  coverUrl: string;
  videoId: string[];
  trackId: number;
};
