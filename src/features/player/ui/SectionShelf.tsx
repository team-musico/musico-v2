"use client";

import Image from "next/image";
import { Loader2, Play } from "lucide-react";
import type { ReactNode } from "react";
import { artistNames } from "@/entities/track/lib/artist-names";
import type { VibeTrack } from "@/entities/track/model/vibe-track";

const SectionShelf = ({
  title,
  icon,
  tracks,
  onPlay,
  loadingTrackId = "",
}: {
  title: string;
  icon: ReactNode;
  tracks: VibeTrack[];
  onPlay: (track: VibeTrack) => void;
  loadingTrackId: string;
}) => {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold text-mp3-text">
          {icon} {title}
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {tracks.map((track, index) => {
          const isLoading = loadingTrackId === String(track.trackId);

          return (
            <button
              key={`${track.trackId}-${index}`}
              onClick={() => onPlay(track)}
              disabled={isLoading}
              className="group rounded-md border border-mp3-border-soft bg-white p-2 text-left text-mp3-text transition active:bg-mp3-primary-soft disabled:cursor-wait disabled:opacity-60 disabled:active:bg-white"
            >
              <div className="relative aspect-square overflow-hidden rounded border border-mp3-border bg-neutral-200">
                <Image src={track.albumArt} alt={`${track.title} album art`} fill sizes="(max-width: 640px) 45vw, 180px" className="object-cover" />
                <span className="absolute bottom-2 right-2 grid size-8 place-items-center rounded-full bg-mp3-primary text-white opacity-0 shadow transition group-active:opacity-100 group-disabled:opacity-100">
                  {isLoading ? <Loader2 className="animate-spin" size={17} /> : <Play size={17} fill="currentColor" />}
                </span>
              </div>
              <p className="mt-2 truncate text-sm font-bold">{track.title}</p>
              <p className="truncate text-xs font-semibold text-mp3-muted">{artistNames(track)}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default SectionShelf;
