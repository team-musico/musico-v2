import type { AdminPlaylist } from "@/entities/playlist/model/admin-playlist";
import type { Track } from "@/entities/track/model/track";
import type { VibeTrack } from "@/entities/track/model/vibe-track";

export type MusicPlayerContextValue = {
  playVibeTrack: (track: VibeTrack) => Promise<void>;
  loadingTrackId: string;
  queue: Track[];
  currentIndex: number;
  playQueueTrack: (index: number) => void;
  removeFromQueue: (trackId: string) => void;
  loadCuratedPlaylistToQueue: (playlist: AdminPlaylist) => void;
};
