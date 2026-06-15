"use client";

import { Library } from "lucide-react";
import type { AdminPlaylist } from "@/entities/playlist/model/admin-playlist";
import { useMusicPlayer } from "@/features/player/model/use-music-player";

const PlaylistsScreen = ({ playlists }: { playlists: AdminPlaylist[] }) => {
  const { loadCuratedPlaylistToQueue } = useMusicPlayer();

  return (
    <section className="rounded-md border border-mp3-border bg-white p-3 text-mp3-text shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-bold">
          <Library size={18} /> 플레이리스트
        </h3>
        <span className="text-xs font-bold text-mp3-muted">{playlists.length} playlists</span>
      </div>
      <div className="grid gap-2">
        {playlists.length ? (
          playlists.slice(0, 12).map((playlist) => (
            <div key={playlist.id} className="rounded border border-mp3-border-soft bg-white p-3">
              <p className="truncate font-bold">{playlist.title}</p>
              <p className="text-xs font-bold text-mp3-muted">{playlist.songs.length} songs</p>
              {playlist.description ? <p className="mt-1 line-clamp-2 text-xs font-semibold text-mp3-muted">{playlist.description}</p> : null}
              <button className="mt-2 text-xs font-bold text-mp3-primary" onClick={() => loadCuratedPlaylistToQueue(playlist)}>
                플레이리스트 재생
              </button>
            </div>
          ))
        ) : (
          <p className="rounded bg-mp3-surface-soft p-3 text-sm font-semibold text-mp3-muted">관리자가 편성한 플레이리스트가 표시됩니다.</p>
        )}
      </div>
    </section>
  );
};

export default PlaylistsScreen;
