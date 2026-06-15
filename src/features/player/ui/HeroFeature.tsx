"use client";

import { Loader2, Play } from "lucide-react";
import { artistNames } from "@/entities/track/lib/artist-names";
import type { VibeTrack } from "@/entities/track/model/vibe-track";
import AlbumArt from "@/features/player/ui/AlbumArt";

const HeroFeature = ({
  track,
  onPlay,
  loadingTrackId = "",
}: {
  track?: VibeTrack;
  onPlay: (track: VibeTrack) => void;
  loadingTrackId: string;
}) => {
  if (!track) return null;

  const isLoading = loadingTrackId === String(track.trackId);

  return (
    <section className="overflow-hidden rounded-md border border-mp3-border bg-white p-3 text-mp3-text shadow-sm">
      <div className="grid grid-cols-[96px_1fr] gap-3">
        <AlbumArt src={track.albumArt} alt={`${track.title} album art`} className="aspect-square rounded border border-mp3-border" />
        <div className="min-w-0">
          <p className="text-xs font-bold text-mp3-muted">Now Featured</p>
          <h3 className="mt-1 truncate text-2xl font-bold leading-tight">{track.title}</h3>
          <p className="mt-1 truncate text-sm font-semibold text-mp3-muted">{artistNames(track)}</p>
          <button
            onClick={() => onPlay(track)}
            disabled={isLoading}
            className="mt-3 inline-flex items-center gap-2 rounded bg-mp3-primary px-4 py-2 text-sm font-bold text-white transition active:brightness-95 disabled:cursor-wait disabled:opacity-60"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} fill="currentColor" />}
            {isLoading ? "불러오는 중" : "재생"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroFeature;
