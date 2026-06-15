import type { Track } from "@/entities/track/model/track";

export type SearchResponse = {
  track: Track;
  candidates: Array<{
    videoId: string;
    title: string;
    matchedArtist: boolean;
    matchedTitle: boolean;
    embeddable: boolean;
  }>;
};
