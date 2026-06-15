type VibeArtist = {
  artistId: number;
  artistName: string;
  isGroup: boolean;
  imageUrl: string;
};

export type VibeApiTrack = {
  trackTitle: string;
  trackId: number;
  album: {
    imageUrl: string;
  };
  artists: VibeArtist[];
};
