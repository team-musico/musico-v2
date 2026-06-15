export type VibeTrack = {
  title: string;
  albumArt: string;
  artists: Array<{
    artistId: number;
    artistName: string;
    isGroup?: boolean;
    imageUrl: string;
  }>;
  trackId: number;
};
