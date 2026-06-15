"use client";

import Image from "next/image";
import { Loader2, Plus, Search, Trash2 } from "lucide-react";
import { useAdminScreen } from "@/features/admin/hooks/useAdminScreen";
import { adminArtistNames } from "@/features/admin/utils/adminArtistNames";

const AdminScreen = () => {
  const admin = useAdminScreen();

  if (!admin.authorized) {
    return (
      <main className="grid min-h-screen place-items-center bg-mp3-admin-bg p-4 text-mp3-text">
        <section className="rounded-2xl bg-white p-6 text-center shadow">
          <Loader2 className="mx-auto animate-spin text-mp3-primary" size={28} />
          <h1 className="mt-4 text-xl font-bold">관리자 권한 확인 중</h1>
          <p className="mt-2 text-sm font-semibold text-mp3-muted">로그인 상태와 role을 확인하고 있습니다.</p>
          {admin.message ? <p className="mt-3 rounded-md bg-mp3-warning-bg p-3 text-sm font-bold text-mp3-warning-text">{admin.message}</p> : null}
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-mp3-admin-bg p-4 text-mp3-text">
      <section className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-2xl bg-white p-4 shadow">
          <h1 className="text-2xl font-bold">Musico Admin</h1>
          <p className="mt-1 text-sm font-semibold text-mp3-muted">admin role 계정으로 편성 플레이리스트를 관리합니다.</p>
          <p className="mt-3 rounded-md bg-mp3-admin-note p-3 text-xs font-bold text-mp3-primary">
            권한 확인 완료. 플레이리스트 데이터는 자동으로 동기화됩니다.
          </p>

          <form onSubmit={admin.createPlaylist} className="mt-5 grid gap-2">
            <h2 className="font-bold">플레이리스트 생성</h2>
            <input value={admin.title} onChange={admin.handleTitleChange} className="h-10 rounded-md border border-mp3-border px-3 font-semibold" placeholder="제목" />
            <textarea value={admin.description} onChange={admin.handleDescriptionChange} className="min-h-20 rounded-md border border-mp3-border p-3 font-semibold" placeholder="설명" />
            <button className="flex h-10 items-center justify-center gap-2 rounded-md bg-mp3-text font-bold text-white">
              <Plus size={16} /> 생성
            </button>
          </form>

          {admin.message ? <p className="mt-4 rounded-md bg-mp3-warning-bg p-3 text-sm font-bold text-mp3-warning-text">{admin.message}</p> : null}
        </aside>

        <section className="grid gap-4">
          <div className="rounded-2xl bg-white p-4 shadow">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">플레이리스트</h2>
              <span className="text-sm font-bold text-mp3-muted">{admin.playlists.length}개</span>
            </div>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {admin.playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={() => admin.setSelectedPlaylistId(playlist.id)}
                  className={`rounded-md border p-3 text-left ${playlist.id === admin.selectedPlaylistId ? "border-mp3-primary bg-mp3-primary-soft" : "border-mp3-border-soft bg-white"}`}
                >
                  <p className="font-bold">{playlist.title}</p>
                  <p className="text-sm font-semibold text-mp3-muted">{playlist.songs.length} songs</p>
                </button>
              ))}
            </div>
          </div>

          {admin.selectedPlaylist ? (
            <div className="rounded-2xl bg-white p-4 shadow">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">{admin.selectedPlaylist.title}</h2>
                  <p className="text-sm font-semibold text-mp3-muted">{admin.selectedPlaylist.description}</p>
                </div>
                <button onClick={() => admin.deletePlaylist(admin.selectedPlaylist!.id)} className="rounded-md bg-red-500 px-3 py-2 text-sm font-bold text-white">
                  삭제
                </button>
              </div>

              <div className="mt-4 grid gap-2">
                {admin.selectedPlaylist.songs.map((song, index) => (
                  <div key={`${song.trackId}-${index}`} className="grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-md border border-mp3-line p-2">
                    <span className="relative size-11 overflow-hidden rounded bg-neutral-200">
                      <Image src={song.coverUrl} alt={song.title} fill sizes="44px" className="object-cover" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-bold">{song.title}</span>
                      <span className="block truncate text-xs font-semibold text-mp3-muted">{song.artist.map((artist) => artist.artistName).join(", ")}</span>
                    </span>
                    <button onClick={() => admin.removeSong(song.trackId)} className="grid size-9 place-items-center rounded-full text-red-500 active:bg-red-50">
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))}
                {!admin.selectedPlaylist.songs.length ? <p className="rounded bg-mp3-surface-soft p-3 text-sm font-semibold text-mp3-muted">아직 곡이 없습니다.</p> : null}
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl bg-white p-4 shadow">
            <form onSubmit={admin.searchSongs} className="grid gap-2 md:grid-cols-[1fr_auto]">
              <input value={admin.query} onChange={admin.handleQueryChange} className="h-11 rounded-md border border-mp3-border px-3 font-semibold" placeholder="추가할 곡 검색" />
              <button className="flex h-11 items-center justify-center gap-2 rounded-md bg-mp3-primary px-4 font-bold text-white">
                <Search size={17} /> 검색
              </button>
            </form>

            <div className="mt-4 grid gap-2">
              {admin.results.slice(0, 20).map((track, index) => (
                <div key={`${track.trackId}-${index}`} className="grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-md border border-mp3-line p-2">
                  <span className="relative size-11 overflow-hidden rounded bg-neutral-200">
                    <Image src={track.albumArt} alt={track.title} fill sizes="44px" className="object-cover" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-bold">{track.title}</span>
                    <span className="block truncate text-xs font-semibold text-mp3-muted">{adminArtistNames(track)}</span>
                  </span>
                  <button onClick={() => admin.addSong(track)} disabled={!admin.selectedPlaylistId || admin.loading} className="rounded-md bg-mp3-text px-3 py-2 text-sm font-bold text-white disabled:opacity-40">
                    추가
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

export default AdminScreen;
