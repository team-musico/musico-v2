"use client";

import { Heart } from "lucide-react";
import type { VibeTrack } from "@/entities/track/model/vibe-track";
import { useMusicPlayer } from "@/features/player/model/use-music-player";
import HeroFeature from "@/features/player/ui/HeroFeature";
import SectionShelf from "@/features/player/ui/SectionShelf";
import TrackTable from "@/features/player/ui/TrackTable";

const HomeScreen = ({ chartTracks, newTracks }: { chartTracks: VibeTrack[]; newTracks: VibeTrack[] }) => {
  const {
    playVibeTrack,
    loadingTrackId,
  } = useMusicPlayer();
  const mixedPicks = [...chartTracks.slice(8, 16), ...newTracks.slice(0, 8)]
    .sort((a, b) => a.trackId - b.trackId)
    .slice(0, 8);

  return (
    <div className="space-y-5">
      <HeroFeature track={chartTracks[0]} onPlay={playVibeTrack} loadingTrackId={loadingTrackId} />
      <SectionShelf title="Quick select" icon={<Heart size={18} />} tracks={mixedPicks} onPlay={playVibeTrack} loadingTrackId={loadingTrackId} />
      <TrackTable title="Chart preview" tracks={chartTracks.slice(0, 10)} onPlay={playVibeTrack} loadingTrackId={loadingTrackId} emptyText="표시할 음원 목록이 없습니다." />
    </div>
  );
};

export default HomeScreen;
