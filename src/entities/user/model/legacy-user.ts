import type { VibeTrack } from "@/entities/track/model/vibe-track";

export type LegacyUser = {
  _id: string;
  id: string;
  username: string;
  role: "user" | "admin";
  currentSong: number;
  queue: Array<{
    artist: VibeTrack["artists"];
    title: string;
    coverUrl: string;
    videoId: string[];
    trackId: number;
  }>;
  isShuffle: boolean;
  createdAt: string;
  updatedAt: string;
};
