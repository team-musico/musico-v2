"use client";

import { useMusicPlayer } from "@/features/player/model/use-music-player";
import type { VibeTrack } from "@/entities/track/model/vibe-track";
import TrackTable from "@/features/player/ui/TrackTable";

const SearchScreen = ({ tracks, query }: { tracks: VibeTrack[]; query: string }) => {
  const {
    playVibeTrack,
    loadingTrackId,
  } = useMusicPlayer();

  return (
    <TrackTable
      title={query ? `"${query}" 검색 결과` : "검색 결과"}
      tracks={tracks}
      onPlay={playVibeTrack}
      loadingTrackId={loadingTrackId}
      emptyText={query ? "검색 결과가 없습니다." : "검색어를 입력하면 최대 200곡까지 보여줍니다."}
    />
  );
};

export default SearchScreen;
