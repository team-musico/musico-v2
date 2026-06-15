"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  BatteryFull,
  Home,
  Library,
  ListMusic,
  Loader2,
  LockKeyhole,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Search,
  Shuffle,
  SkipBack,
  SkipForward,
  Sparkles,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import MusicPlayerProvider from "@/features/player/ui/music-player-provider";
import { cx } from "@/shared/lib/cx";
import { formatTime } from "@/shared/lib/format-time";
import { VIEW_ROUTES } from "@/features/player/constants/viewRoutes";
import { useMusicStudio } from "@/features/player/hooks/useMusicStudio";
import NavButton from "@/widgets/music-player/ui/nav-button";

const ReactPlayer = dynamic(() => import("react-player/youtube"), {
  ssr: false,
});

const MusicStudio = ({ children }: { children?: ReactNode }) => {
  const {
    authLoading,
    authMode,
    authOpen,
    authT,
    closeAuth,
    currentTrack,
    currentUser,
    duration,
    error,
    handleDuration,
    handleEnded,
    handleManualSearch,
    handlePasswordChange,
    handlePlayerError,
    handlePlayerPause,
    handlePlayerPlay,
    handlePlayerReady,
    handleProgress,
    handleSearchQueryChange,
    handleSeekChange,
    handleUsernameChange,
    loadingTrackId,
    locale,
    password,
    playNext,
    playPrevious,
    playedSeconds,
    playbackIntentPlaying,
    playerContextValue,
    playerRef,
    playing,
    progressPercent,
    repeatMode,
    searchQuery,
    shuffle,
    submitAuth,
    systemTime,
    t,
    toggleAuthMode,
    toggleLocale,
    togglePlaying,
    toggleRepeatMode,
    toggleShuffle,
    username,
    view,
  } = useMusicStudio();
  const isResolvingTrack = Boolean(loadingTrackId);
  const isPlaybackPending = Boolean(currentTrack) && playbackIntentPlaying && !playing && !isResolvingTrack;

  return (
    <MusicPlayerProvider value={playerContextValue}>
      <main className="mp3-stage min-h-screen bg-app-bg px-3 py-4 text-white sm:px-4">
        <div className="youtube-audio-host" aria-hidden="true">
          {currentTrack ? (
            <ReactPlayer
              ref={playerRef}
              key={currentTrack.videoId}
              url={currentTrack.url}
              playing={playbackIntentPlaying}
              muted={false}
              playsinline
              volume={1}
              width="200px"
              height="200px"
              controls={false}
              onDuration={handleDuration}
              onEnded={handleEnded}
              onError={handlePlayerError}
              onPause={handlePlayerPause}
              onPlay={handlePlayerPlay}
              onProgress={handleProgress}
              onReady={handlePlayerReady}
              config={{ playerVars: { modestbranding: 1, rel: 0 } }}
            />
          ) : null}
        </div>

        <section className="mp3-stage-shell mx-auto flex min-h-[calc(100vh-32px)] w-full max-w-[560px] items-center justify-center">
          <div className="mp3-device">
            <div className="mb-5 flex items-center justify-between px-4 pt-1 text-mp3-brand">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em]">musico</p>
                <h1 className="text-2xl font-bold leading-none">{t.brand}</h1>
              </div>
            </div>

            <div className="grid gap-0">
              <section className="mp3-screen-shell">
                <div className="mp3-screen relative">
                  <div className="absolute inset-x-0 top-0 z-30 flex h-7 items-center justify-between border-b border-mp3-status-border bg-mp3-panel/95 px-3 text-[10px] font-semibold text-mp3-subtle backdrop-blur">
                    <span className="w-16 tabular-nums">{systemTime}</span>
                    <span className="absolute left-1/2 -translate-x-1/2 text-[10px] font-bold text-mp3-muted-strong">
                      {playing ? t.statusPlay : t.statusReady}
                    </span>
                    <span className="flex min-w-0 items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={toggleLocale}
                        className="rounded-[3px] px-1 py-0.5 text-[9px] font-bold leading-none text-mp3-system active:bg-mp3-system-soft"
                        title="Language"
                      >
                        {locale.toUpperCase()}
                      </button>
                      {currentUser?.role === "admin" ? (
                        <Link href="/admin" className="rounded-[3px] px-1 py-0.5 text-[9px] font-bold leading-none text-mp3-system active:bg-mp3-system-soft">
                          ADMIN
                        </Link>
                      ) : null}
                      {currentUser ? (
                        <span className="max-w-14 truncate rounded-[3px] px-1 py-0.5 text-[9px] font-bold leading-none text-mp3-muted">
                          {currentUser.username}
                        </span>
                      ) : (
                        <Link href="/auth" className="rounded-[3px] px-1 py-0.5 text-[9px] font-bold leading-none text-mp3-system active:bg-mp3-system-soft">
                          {authT.modeLogin}
                        </Link>
                      )}
                      <BatteryFull size={13} strokeWidth={2.2} />
                    </span>
                  </div>

                  <div className="h-full overflow-auto p-4 pt-10 sm:p-5 sm:pt-11">
                    <div className="mb-3 overflow-hidden rounded-md border border-mp3-border-strong bg-white text-mp3-text shadow-sm">
                      <div className="flex items-center justify-between gap-2 border-b border-mp3-border mp3-toolbar-gradient px-3 py-1 text-[11px] font-bold">
                        <span>Musico</span>
                        <span>{playing ? "▶" : "Ⅱ"} {formatTime(playedSeconds)}</span>
                      </div>
                      <div className="grid gap-3 p-3">
                        <div className="min-w-0">
                          <p className="text-xs font-bold uppercase text-mp3-muted">{t.music}</p>
                          <p className="truncate text-2xl font-bold leading-tight">
                            {currentTrack ? currentTrack.title : t.selectTrack}
                          </p>
                          <p className="truncate text-xs font-bold text-mp3-muted">
                            {currentTrack?.artist ?? t.chartReady}
                          </p>
                        </div>
                        <form onSubmit={handleManualSearch} className="grid min-w-0 gap-2 sm:grid-cols-[1fr_auto]">
                          <input
                            value={searchQuery}
                            onChange={handleSearchQueryChange}
                            className="h-9 min-w-0 rounded border border-mp3-border-strong bg-white px-3 text-sm font-semibold text-mp3-text outline-none placeholder:text-mp3-rank"
                            placeholder={t.searchPlaceholder}
                          />
                          <button className="flex h-9 items-center justify-center gap-2 rounded bg-mp3-primary px-4 font-bold text-white">
                            <Search size={16} />
                            {t.search}
                          </button>
                        </form>
                      </div>
                    </div>

                    <nav className="mb-4 overflow-hidden rounded-md border border-mp3-border bg-white text-sm font-bold shadow-sm">
                      <NavButton active={view === "home"} icon={<Home size={15} />} label={t.home} href={VIEW_ROUTES.home} />
                      {currentUser ? (
                        <>
                          <NavButton active={view === "chart"} icon={<TrendingUp size={15} />} label={t.chart} href={VIEW_ROUTES.chart} />
                          <NavButton active={view === "new"} icon={<Sparkles size={15} />} label={t.newSongs} href={VIEW_ROUTES.new} />
                        </>
                      ) : null}
                      <NavButton active={view === "search"} icon={<Search size={15} />} label={t.searchMenu} href={VIEW_ROUTES.search} />
                      {currentUser ? (
                        <NavButton active={view === "playlists"} icon={<Library size={15} />} label={t.playlists} href={VIEW_ROUTES.playlists} />
                      ) : null}
                      <NavButton active={view === "queue"} icon={<ListMusic size={15} />} label={t.queue} href={VIEW_ROUTES.queue} />
                    </nav>

                    {error ? (
                      <div className="mb-4 rounded-md border border-red-400/20 bg-red-500/10 p-3 text-sm font-semibold text-red-100">
                        {error}
                      </div>
                    ) : null}

                    <div className="space-y-5">{children}</div>
                  </div>
                </div>
              </section>

              <aside className="mp3-control-well px-4 pb-1 pt-5">
                <div className="grid grid-cols-[42px_1fr_42px] items-center gap-2">
                  <span className="text-right text-[11px] font-bold text-mp3-control-text">{formatTime(playedSeconds)}</span>
                  <label className="relative block h-5">
                    <span className="pointer-events-none absolute left-0 top-1/2 h-[7px] -translate-y-1/2 rounded-full bg-mp3-control" style={{ width: `${progressPercent}%` }} />
                    <input
                      type="range"
                      min={0}
                      max={Math.max(duration, 0)}
                      value={Math.min(playedSeconds, duration || 0)}
                      onChange={handleSeekChange}
                      disabled={!currentTrack || !duration}
                      className="player-range relative z-10 h-5 w-full appearance-none bg-transparent disabled:opacity-50"
                      aria-label="재생 위치"
                    />
                  </label>
                  <span className="text-[11px] font-bold text-mp3-control-text">{formatTime(duration)}</span>
                </div>

                <div className="mp3-click-wheel">
                  <button className={cx("mp3-wheel-btn mp3-wheel-top", shuffle && "is-active")} onClick={toggleShuffle} title={shuffle ? "셔플 켜짐" : "셔플 꺼짐"} aria-pressed={shuffle}>
                    <Shuffle size={19} />
                  </button>
                  <button className="mp3-wheel-btn mp3-wheel-right" onClick={playNext} title="다음곡">
                    <SkipForward size={21} />
                  </button>
                  <button className={cx("mp3-wheel-btn mp3-wheel-bottom", repeatMode !== "off" && "is-active")} onClick={toggleRepeatMode} title={`반복: ${repeatMode}`} aria-pressed={repeatMode !== "off"}>
                    {repeatMode === "one" ? <Repeat1 size={19} /> : <Repeat size={19} />}
                  </button>
                  <button className="mp3-wheel-btn mp3-wheel-left" onClick={playPrevious} title="이전곡">
                    <SkipBack size={21} />
                  </button>
                  <button
                    className="mp3-wheel-center"
                    onClick={togglePlaying}
                    disabled={!currentTrack || isResolvingTrack}
                    title={isResolvingTrack || isPlaybackPending ? "불러오는 중" : playing ? "일시정지" : "재생"}
                  >
                    {isResolvingTrack || isPlaybackPending ? <Loader2 className="animate-spin" size={30} /> : playing ? <Pause size={34} fill="currentColor" /> : <Play size={34} fill="currentColor" />}
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {authOpen ? (
          <div className="fixed inset-0 z-30 grid place-items-center bg-black/75 p-4 backdrop-blur-sm">
            <form onSubmit={submitAuth} className="w-full max-w-sm rounded-[28px] border border-white/80 mp3-auth-panel p-5 text-mp3-text shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-bold">{authMode === "login" ? authT.modeLogin : authT.modeSignup}</h2>
                <button type="button" className="grid size-8 place-items-center rounded-full active:bg-mp3-system-soft" onClick={closeAuth}><X size={20} /></button>
              </div>
              <div className="grid gap-3">
                <span className="mp3-auth-field">
                  <User size={17} />
                  <input value={username} onChange={handleUsernameChange} className="min-w-0 flex-1 bg-transparent font-bold text-mp3-text outline-none placeholder:text-mp3-rank" placeholder={authT.username} />
                </span>
                <span className="mp3-auth-field">
                  <LockKeyhole size={17} />
                  <input value={password} onChange={handlePasswordChange} type="password" className="min-w-0 flex-1 bg-transparent font-bold text-mp3-text outline-none placeholder:text-mp3-rank" placeholder={authT.passwordPlaceholder} />
                </span>
                <button disabled={authLoading} className="mp3-auth-primary-button flex h-12 items-center justify-center gap-2 rounded-md font-bold text-white transition active:brightness-95 disabled:opacity-70">
                  {authLoading ? <Loader2 className="animate-spin" size={18} /> : <User size={18} />}
                  {authMode === "login" ? t.signIn : t.createAccount}
                </button>
                <button type="button" className="text-sm font-bold text-mp3-muted active:text-mp3-text" onClick={toggleAuthMode}>
                  {authMode === "login" ? t.noAccount : t.hasAccount}
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </main>
    </MusicPlayerProvider>
  );
};

export default MusicStudio;
