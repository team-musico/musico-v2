import { toLegacyVibeTrack } from "@/entities/vibe/lib/to-legacy-vibe-track";
import type { VibeApiTrack } from "@/entities/vibe/model/vibe-api-track";
import { fetchVibe } from "@/entities/vibe/server/fetch-vibe";

export const searchVibeTracks = async (query: string) => {
  const params = new URLSearchParams({
    query,
    start: "1",
    display: "100",
    sort: "RELEVANCE",
    cact: "ogn",
  });
  const moreParams = new URLSearchParams(params);
  moreParams.set("start", "101");

  const [first, second] = await Promise.all([
    fetchVibe(
      `https://apis.naver.com/vibeWeb/musicapiweb/v4/search/track?${params}`,
    ),
    fetchVibe(
      `https://apis.naver.com/vibeWeb/musicapiweb/v4/search/track?${moreParams}`,
    ),
  ]);

  const tracks = first.response?.result?.tracks ?? [];
  const moreTracks = second.response?.result?.tracks ?? [];

  return [...(tracks as VibeApiTrack[]), ...(moreTracks as VibeApiTrack[])].map(
    toLegacyVibeTrack,
  );
};
