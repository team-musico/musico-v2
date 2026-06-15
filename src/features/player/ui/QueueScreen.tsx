"use client";

import { ListMusic } from "lucide-react";
import { useMusicPlayer } from "@/features/player/model/use-music-player";
import { cx } from "@/shared/lib/cx";

const QueueScreen = () => {
  const { queue, currentIndex, playQueueTrack, removeFromQueue } = useMusicPlayer();

  return (
    <section className="rounded-md border border-mp3-border bg-white p-3 text-mp3-text shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-bold">
          <ListMusic size={18} /> 재생목록
        </h3>
        <span className="text-xs font-bold text-mp3-muted">{queue.length} songs</span>
      </div>
      <div className="max-h-[270px] overflow-auto">
        {queue.length ? (
          queue.map((track, index) => (
            <div key={track.id} className={cx("grid grid-cols-[1fr_34px] items-center gap-2 border-b border-mp3-line p-2 last:border-b-0", index === currentIndex ? "bg-mp3-primary text-white" : "active:bg-mp3-primary-soft")}>
              <button
                onClick={() => playQueueTrack(index)}
                className="min-w-0 text-left"
              >
                <span className="block truncate text-sm font-bold">{track.title}</span>
                <span className="block truncate text-xs font-semibold opacity-70">{track.artist}</span>
              </button>
              <button onClick={() => removeFromQueue(track.id)} className="grid size-8 place-items-center rounded-full active:bg-black/10" title="큐에서 제거">
                x
              </button>
            </div>
          ))
        ) : (
          <p className="rounded bg-mp3-surface-soft p-3 text-sm font-semibold text-mp3-muted">아직 큐가 비어 있습니다.</p>
        )}
      </div>
    </section>
  );
};

export default QueueScreen;
