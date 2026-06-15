"use client";

import { useMusicPlayer } from "@/features/player/model/use-music-player";
import type { VibeTrack } from "@/entities/track/model/vibe-track";
import TrackTable from "@/features/player/ui/TrackTable";

const NewSongsScreen = ({ tracks }: { tracks: VibeTrack[] }) => {
  const {
    playVibeTrack,
    loadingTrackId,
  } = useMusicPlayer();

  return <TrackTable title={`${tracks.length} 신곡`} tracks={tracks} onPlay={playVibeTrack} loadingTrackId={loadingTrackId} emptyText="표시할 음원 목록이 없습니다." />;
};

export default NewSongsScreen;
