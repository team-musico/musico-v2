import type { LegacyArtist } from "@/entities/legacy/model/legacy-artist";

export type LegacyVibeTrack = {
  title: string;
  albumArt: string;
  artists: LegacyArtist[];
  trackId: number;
};
