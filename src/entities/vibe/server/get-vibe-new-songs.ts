import { toLegacyVibeTrack } from "@/entities/vibe/lib/to-legacy-vibe-track";
import type { VibeApiTrack } from "@/entities/vibe/model/vibe-api-track";
import { fetchVibe } from "@/entities/vibe/server/fetch-vibe";

export const getVibeNewSongs = async () => {
  const payload = await fetchVibe(
    "https://apis.naver.com/vibeWeb/musicapiweb/vibe/v1/recommend/tracks/recent?start=1&display=100",
  );
  const tracks = payload.response?.result?.tracks ?? [];

  return (tracks as VibeApiTrack[]).map(toLegacyVibeTrack);
};
