import type { AdminPlaylist } from "@/entities/playlist/model/admin-playlist";
import type { Track } from "@/entities/track/model/track";

export const adminSongToTrack = (song: AdminPlaylist["songs"][number]): Track => {
  const videoId = song.videoId[0] ?? "";

  return {
    id: `admin-${song.trackId}-${videoId}`,
    videoId,
    title: song.title,
    artist: song.artist.map((artist) => artist.artistName).join(", "),
    requestedTitle: song.title,
    coverUrl: song.coverUrl,
    trackId: song.trackId,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    sourceTitle: song.title,
  };
};
