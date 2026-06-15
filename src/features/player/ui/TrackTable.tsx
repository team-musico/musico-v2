"use client";

import { Loader2, Play } from "lucide-react";
import { artistNames } from "@/entities/track/lib/artist-names";
import type { VibeTrack } from "@/entities/track/model/vibe-track";
import AlbumArt from "@/features/player/ui/AlbumArt";

const TrackTable = ({
  title,
  tracks,
  onPlay,
  loadingTrackId = "",
  emptyText,
}: {
  title: string;
  tracks: VibeTrack[];
  onPlay: (track: VibeTrack) => void;
  loadingTrackId: string;
  emptyText: string;
}) => {
  return (
    <section className="overflow-hidden rounded-md border border-mp3-border bg-white text-mp3-text shadow-sm">
      <div className="border-b border-mp3-border mp3-table-header-gradient px-3 py-2">
        <h3 className="font-bold">{title}</h3>
      </div>
      <div className="grid grid-cols-[34px_1fr_58px] gap-2 border-b border-mp3-border-soft px-3 py-2 text-xs font-bold uppercase text-mp3-muted">
        <span>#</span>
        <span>제목</span>
        <span className="text-right">재생</span>
      </div>
      {tracks.length === 0 ? <div className="px-4 py-10 text-sm font-bold text-mp3-muted">{emptyText}</div> : null}
      {tracks.map((track, index) => {
        const isLoading = loadingTrackId === String(track.trackId);

        return (
          <button
            key={`${track.trackId}-${index}`}
            onClick={() => onPlay(track)}
            disabled={isLoading}
            className="group grid w-full grid-cols-[34px_1fr_58px] items-center gap-2 border-b border-mp3-line px-3 py-2 text-left transition last:border-b-0 active:bg-mp3-primary active:text-white disabled:cursor-wait disabled:opacity-60 disabled:active:bg-transparent disabled:active:text-mp3-text"
          >
            <span className="text-sm font-bold text-mp3-rank group-active:text-white">{String(index + 1).padStart(2, "0")}</span>
            <span className="flex min-w-0 items-center gap-2">
              <AlbumArt src={track.albumArt} alt={`${track.title} album art`} className="size-9 shrink-0 rounded border border-mp3-border" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold">{track.title}</span>
                <span className="block truncate text-xs font-semibold text-mp3-muted group-active:text-white/85">{artistNames(track)}</span>
              </span>
            </span>
            <span className="flex justify-end">
              <span className="grid size-8 place-items-center rounded-full bg-mp3-track-control-bg text-mp3-button-text group-active:bg-white group-active:text-mp3-primary">
                {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} fill="currentColor" />}
              </span>
            </span>
          </button>
        );
      })}
    </section>
  );
};

export default TrackTable;
