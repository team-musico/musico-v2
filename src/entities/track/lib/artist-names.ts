import type { VibeTrack } from "@/entities/track/model/vibe-track";

export const artistNames = (track: VibeTrack) =>
  track.artists.map((artist) => artist.artistName).join(", ");
