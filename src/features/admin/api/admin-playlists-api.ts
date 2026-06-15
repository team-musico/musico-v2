import type { AdminPlaylist } from "@/entities/playlist/model/admin-playlist";
import type { VibeTrack } from "@/entities/track/model/vibe-track";
import { withAuthHeaders } from "@/shared/api/with-auth-headers";

export const adminPlaylistsApi = {
  list: async (token: string) => {
    const response = await fetch("/api/admin/playlists", {
      headers: withAuthHeaders(token),
    });
    const payload = await response.json();

    return { response, payload: payload as AdminPlaylist[] | { message?: string } };
  },
  create: async (token: string, title: string, description: string) => {
    const response = await fetch("/api/admin/playlists", {
      method: "POST",
      headers: withAuthHeaders(token),
      body: JSON.stringify({ title, description }),
    });
    const payload = await response.json().catch(() => null);

    return { response, payload };
  },
  remove: async (token: string, playlistId: string) => {
    const response = await fetch(`/api/admin/playlists?playlistId=${playlistId}`, {
      method: "DELETE",
      headers: withAuthHeaders(token),
    });
    const payload = await response.json().catch(() => null);

    return { response, payload };
  },
  addSong: async (token: string, playlistId: string, track: VibeTrack, videoId: string) => {
    const response = await fetch(`/api/admin/playlists/song?playlistId=${playlistId}`, {
      method: "POST",
      headers: withAuthHeaders(token),
      body: JSON.stringify({
        artist: track.artists,
        title: track.title,
        coverUrl: track.albumArt,
        videoId: [videoId],
        trackId: track.trackId,
      }),
    });
    const payload = await response.json().catch(() => null);

    return { response, payload };
  },
  removeSong: async (token: string, playlistId: string, trackId: number) => {
    const response = await fetch(`/api/admin/playlists/song?playlistId=${playlistId}&trackId=${trackId}`, {
      method: "DELETE",
      headers: withAuthHeaders(token),
    });
    const payload = await response.json().catch(() => null);

    return { response, payload };
  },
};
