import type { VibeTrack } from "@/entities/track/model/vibe-track";

export const toLegacySong = (track: VibeTrack, videoId: string) => ({
    artist: track.artists,
    title: track.title,
    coverUrl: track.albumArt,
    videoId: [videoId],
    trackId: track.trackId,
  });
