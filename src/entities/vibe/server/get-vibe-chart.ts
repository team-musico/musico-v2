import { toLegacyVibeTrack } from "@/entities/vibe/lib/to-legacy-vibe-track";
import type { VibeApiTrack } from "@/entities/vibe/model/vibe-api-track";
import { fetchVibe } from "@/entities/vibe/server/fetch-vibe";

export const getVibeChart = async () => {
  const payload = await fetchVibe(
    "https://apis.naver.com/vibeWeb/musicapiweb/vibe/v1/chart/track/total",
  );
  const tracks = payload.response?.result?.chart?.items?.tracks ?? [];

  return (tracks as VibeApiTrack[]).map(toLegacyVibeTrack);
};
