import type { VibeTrack } from "@/entities/track/model/vibe-track";

export const vibeSongsApi = {
  search: async (query: string) => {
    const response = await fetch(`/api/songs/search?q=${encodeURIComponent(query.trim())}`);
    const payload = await response.json();

    return { response, payload: payload as VibeTrack[] };
  },
};
