import type { VibeTrack } from "@/entities/track/model/vibe-track";

export type AdminPlaylist = {
  id: string;
  title: string;
  description: string | null;
  songs: Array<{
    artist: VibeTrack["artists"];
    title: string;
    coverUrl: string;
    videoId: string[];
    trackId: number;
  }>;
  createdAt: string;
  updatedAt: string;
};
