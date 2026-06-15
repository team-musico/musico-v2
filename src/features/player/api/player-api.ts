import type { VibeTrack } from "@/entities/track/model/vibe-track";
import type { SearchResponse } from "@/features/search/model/search-response";
import { jsonHeaders } from "@/shared/api/json-headers";
import { withAuthHeaders } from "@/shared/api/with-auth-headers";

export const playerApi = {
  resolvePlayableTrack: async (artist: string, title: string) => {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({ artist, title }),
    });
    const payload = (await response.json()) as
      | SearchResponse
      | { error?: string; candidates?: SearchResponse["candidates"] };

    return { response, payload };
  },
  syncQueueSong: (token: string, source: VibeTrack, videoId: string) =>
    fetch("/api/queue", {
      method: "POST",
      headers: withAuthHeaders(token),
      body: JSON.stringify({
        artist: source.artists,
        title: source.title,
        coverUrl: source.albumArt,
        videoId: [videoId],
        trackId: source.trackId,
      }),
    }),
};
