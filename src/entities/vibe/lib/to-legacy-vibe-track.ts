import type { LegacyVibeTrack } from "@/entities/legacy/model/legacy-vibe-track";
import type { VibeApiTrack } from "@/entities/vibe/model/vibe-api-track";

export const toLegacyVibeTrack = (track: VibeApiTrack): LegacyVibeTrack => ({
    title: track.trackTitle,
    albumArt: track.album.imageUrl,
    artists: track.artists,
    trackId: track.trackId,
  });
