import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { APP_MESSAGES } from "messages/app-messages";
import type { AdminPlaylist } from "@/entities/playlist/model/admin-playlist";
import { artistNames } from "@/entities/track/lib/artist-names";
import type { Track } from "@/entities/track/model/track";
import type { VibeTrack } from "@/entities/track/model/vibe-track";
import type { LegacyUser } from "@/entities/user/model/legacy-user";
import { authApi } from "@/features/auth/api/auth-api";
import { adminSongToTrack } from "@/features/player/lib/admin-song-to-track";
import { cycleRepeat } from "@/features/player/lib/cycle-repeat";
import { readStoredState } from "@/features/player/lib/read-stored-state";
import type { RepeatMode } from "@/features/player/model/repeat-mode";
import { playerApi } from "@/features/player/api/player-api";
import { VIEW_ROUTES } from "@/features/player/constants/viewRoutes";
import { viewFromPathname } from "@/features/player/utils/viewFromPathname";

const STORAGE_KEY = "musico-v2-state";
const TOKEN_KEY = "musico-access-token";
const REFRESH_TOKEN_KEY = "musico-refresh-token";
const LOCALE_KEY = "musico-locale";

type AuthMode = "login" | "signup";
type Locale = "ko" | "en";
type YouTubeInternalPlayer = {
  pauseVideo?: () => void;
  playVideo?: () => void;
  setVolume?: (volume: number) => void;
  unMute?: () => void;
};
type PlayerRef = {
  getInternalPlayer?: () => YouTubeInternalPlayer | null;
  seekTo: (amount: number, type?: "seconds") => void;
};

export const useMusicStudio = () => {
  const router = useRouter();
  const pathname = usePathname();
  const playerRef = useRef<PlayerRef | null>(null);
  const playbackRequestIdRef = useRef(0);
  const playableTrackCacheRef = useRef<Map<string, Track>>(new Map());
  const [mounted, setMounted] = useState(false);
  const [locale, setLocale] = useState<Locale>("ko");
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [playbackIntentPlaying, setPlaybackIntentPlaying] = useState(false);
  const [readyPlaybackVideoId, setReadyPlaybackVideoId] = useState("");
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("off");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingTrackId, setLoadingTrackId] = useState("");
  const [error, setError] = useState("");
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authOpen, setAuthOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [currentUser, setCurrentUser] = useState<LegacyUser | null>(null);
  const [systemTime, setSystemTime] = useState("9:41");
  const view = viewFromPathname(pathname);
  const authT = APP_MESSAGES[locale].auth;
  const t = APP_MESSAGES[locale].player;
  const currentTrack = queue[currentIndex];
  const progressPercent = duration ? Math.min((playedSeconds / duration) * 100, 100) : 0;

  const refreshMe = async (token = accessToken) => {
    if (!token) return;

    const { response, user } = await authApi.me(token);
    if (!response.ok || !user) {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);
      setAccessToken("");
      setCurrentUser(null);
      return;
    }

    setCurrentUser(user);
  };

  useEffect(() => {
    const stored = readStoredState(STORAGE_KEY);
    const token = window.localStorage.getItem(TOKEN_KEY) ?? "";
    const storedLocale = window.localStorage.getItem(LOCALE_KEY);

    // localStorage is only available after the client mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQueue(stored.queue);
    setAccessToken(token);
    if (storedLocale === "ko" || storedLocale === "en") setLocale(storedLocale);
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateSystemTime = () => {
      setSystemTime(
        new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    };

    updateSystemTime();
    const timer = window.setInterval(updateSystemTime, 30_000);

    return () => window.clearInterval(timer);
  }, [locale]);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ queue }));
  }, [mounted, queue]);

  useEffect(() => {
    // Reset scrubber state when the actual playback source changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlayedSeconds(0);
    setDuration(0);
  }, [currentTrack?.videoId]);

  useEffect(() => {
    if (!readyPlaybackVideoId || currentTrack?.videoId !== readyPlaybackVideoId) return;

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      const internalPlayer = playerRef.current?.getInternalPlayer?.();

      if (typeof internalPlayer?.playVideo === "function") {
        internalPlayer.unMute?.();
        internalPlayer.setVolume?.(100);
        setPlaybackIntentPlaying(true);
        internalPlayer.playVideo();
        setReadyPlaybackVideoId("");
        window.clearInterval(timer);
        return;
      }

      if (attempts >= 20) {
        window.clearInterval(timer);
      }
    }, 100);

    return () => window.clearInterval(timer);
  }, [currentTrack?.videoId, readyPlaybackVideoId]);

  useEffect(() => {
    if (!playbackIntentPlaying || !currentTrack) return;

    const timer = window.setTimeout(() => {
      const internalPlayer = playerRef.current?.getInternalPlayer?.();
      internalPlayer?.unMute?.();
      internalPlayer?.setVolume?.(100);
      internalPlayer?.playVideo?.();
    }, 120);

    return () => window.clearTimeout(timer);
  }, [currentTrack, playbackIntentPlaying]);

  useEffect(() => {
    if (!accessToken) return;
    // Stored token hydration should refresh the user profile once.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshMe(accessToken);
    // Run only when the stored auth token changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const toggleLocale = () => {
    setLocale((value) => {
      const nextLocale = value === "ko" ? "en" : "ko";
      window.localStorage.setItem(LOCALE_KEY, nextLocale);
      document.cookie = `${LOCALE_KEY}=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;

      return nextLocale;
    });
  };

  const addTrackToQueue = (track: Track, startPlayback = true) => {
    setQueue((items) => {
      const duplicateIndex = items.findIndex(
        (item) =>
          (track.trackId && item.trackId === track.trackId) ||
          item.videoId === track.videoId,
      );

      if (duplicateIndex >= 0) {
        const nextQueue = items.map((item, index) =>
          index === duplicateIndex ? track : item,
        );
        setCurrentIndex(duplicateIndex);
        return nextQueue;
      }

      const nextQueue = [...items, track];
      setCurrentIndex(nextQueue.length - 1);

      return nextQueue;
    });
    if (startPlayback) setPlaybackIntentPlaying(true);
  };

  const createPlayableTrackCacheKey = (selectedArtist: string, selectedTitle: string) =>
    `${selectedArtist.toLowerCase().trim()}::${selectedTitle.toLowerCase().trim()}`;

  const fetchPlayableTrack = async (selectedArtist: string, selectedTitle: string, source?: VibeTrack) => {
    const cacheKey = createPlayableTrackCacheKey(selectedArtist, selectedTitle);
    const cachedTrack = playableTrackCacheRef.current.get(cacheKey);
    if (cachedTrack) return cachedTrack;

    const { response, payload } = await playerApi.resolvePlayableTrack(selectedArtist, selectedTitle);

    if (!response.ok || !("track" in payload)) {
      const message = "error" in payload ? payload.error : undefined;
      throw new Error(message ?? "재생 가능한 음원을 찾지 못했습니다.");
    }

    const playableTrack = {
      ...payload.track,
      artist: source ? selectedArtist : payload.track.artist,
      title: source ? source.title : payload.track.title,
      coverUrl: source?.albumArt,
      trackId: source?.trackId,
    } satisfies Track;
    playableTrackCacheRef.current.set(cacheKey, playableTrack);

    return playableTrack;
  };

  const playVibeTrack = async (track: VibeTrack) => {
    const requestId = playbackRequestIdRef.current + 1;
    playbackRequestIdRef.current = requestId;
    const key = String(track.trackId);
    setLoadingTrackId(key);
    setError("");
    setPlaying(false);
    setPlaybackIntentPlaying(false);

    try {
      const playableTrack = await fetchPlayableTrack(artistNames(track), track.title, track);
      if (requestId !== playbackRequestIdRef.current) return;

      setReadyPlaybackVideoId(playableTrack.videoId);
      addTrackToQueue(playableTrack, false);

      if (accessToken) {
        await playerApi.syncQueueSong(accessToken, track, playableTrack.videoId);
        refreshMe();
      }
    } catch (trackError) {
      if (requestId !== playbackRequestIdRef.current) return;

      setError(
        trackError instanceof Error
          ? trackError.message
          : "재생 가능한 음원을 찾지 못했습니다.",
      );
    } finally {
      if (requestId === playbackRequestIdRef.current) setLoadingTrackId("");
    }
  };

  const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleManualSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;
    setError("");
    router.push(`${VIEW_ROUTES.search}?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const submitAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthLoading(true);
    setError("");

    try {
      const { response, payload } = authMode === "signup"
        ? await authApi.signup(username, password)
        : await authApi.login(username, password);

      if (!response.ok) {
        throw new Error(payload.message ?? "인증에 실패했습니다.");
      }

      if (authMode === "signup") {
        setAuthMode("login");
        setError(t.loginDone);
        return;
      }

      window.localStorage.setItem(TOKEN_KEY, payload.accessToken);
      window.localStorage.setItem(REFRESH_TOKEN_KEY, payload.refreshToken);
      setAccessToken(payload.accessToken);
      setAuthOpen(false);
      setUsername("");
      setPassword("");
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "인증에 실패했습니다.");
    } finally {
      setAuthLoading(false);
    }
  };

  const playNext = () => {
    if (!queue.length) return;
    if (shuffle && queue.length > 1) {
      let next = Math.floor(Math.random() * queue.length);
      if (next === currentIndex) next = (next + 1) % queue.length;
      setReadyPlaybackVideoId(queue[next].videoId);
      setPlaying(false);
      setPlaybackIntentPlaying(false);
      setCurrentIndex(next);
      return;
    }

    if (currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      setReadyPlaybackVideoId(queue[nextIndex].videoId);
      setPlaying(false);
      setPlaybackIntentPlaying(false);
      setCurrentIndex((index) => index + 1);
      return;
    }

    if (repeatMode === "all") {
      setReadyPlaybackVideoId(queue[0].videoId);
      setPlaying(false);
      setPlaybackIntentPlaying(false);
      setCurrentIndex(0);
      return;
    }

    setPlaying(false);
    setPlaybackIntentPlaying(false);
  };

  const playPrevious = () => {
    if (!queue.length) return;
    if (currentIndex > 0) {
      const previousIndex = currentIndex - 1;
      setReadyPlaybackVideoId(queue[previousIndex].videoId);
      setPlaying(false);
      setPlaybackIntentPlaying(false);
      setCurrentIndex((index) => index - 1);
      return;
    }

    if (repeatMode === "all") {
      const previousIndex = queue.length - 1;
      setReadyPlaybackVideoId(queue[previousIndex].videoId);
      setPlaying(false);
      setPlaybackIntentPlaying(false);
      setCurrentIndex(previousIndex);
    }
  };

  const handleEnded = () => {
    setPlaying(false);
    setPlaybackIntentPlaying(false);

    if (repeatMode === "one") {
      playerRef.current?.seekTo(0, "seconds");
      window.setTimeout(() => setPlaybackIntentPlaying(true), 60);
      return;
    }

    playNext();
  };

  const loadCuratedPlaylistToQueue = (playlist: AdminPlaylist) => {
    const tracks = playlist.songs.map(adminSongToTrack);
    setQueue(tracks);
    setCurrentIndex(0);
    setPlaying(false);
    setPlaybackIntentPlaying(false);
    if (tracks[0]) setReadyPlaybackVideoId(tracks[0].videoId);
  };

  const removeFromQueue = (trackId: string) => {
    setQueue((items) => {
      const nextQueue = items.filter((track) => track.id !== trackId);
      setCurrentIndex((index) => Math.min(index, Math.max(nextQueue.length - 1, 0)));

      return nextQueue;
    });
  };

  const seekTo = (value: string) => {
    const seconds = Number(value);
    setPlayedSeconds(seconds);
    playerRef.current?.seekTo(seconds, "seconds");
  };

  const handleSeekChange = (event: ChangeEvent<HTMLInputElement>) => {
    seekTo(event.target.value);
  };

  const handleProgress = ({ playedSeconds: seconds }: { playedSeconds: number }) => {
    setPlayedSeconds(seconds);
  };

  const handleDuration = (seconds: number) => {
    setDuration(seconds);
  };

  const handlePlayerReady = () => {
    if (!currentTrack || currentTrack.videoId !== readyPlaybackVideoId) return;

    const internalPlayer = playerRef.current?.getInternalPlayer?.();
    if (typeof internalPlayer?.playVideo !== "function") return;

    internalPlayer?.unMute?.();
    internalPlayer?.setVolume?.(100);
    setPlaybackIntentPlaying(true);
    internalPlayer.playVideo();
    setReadyPlaybackVideoId("");
  };

  const handlePlayerPlay = () => {
    setPlaybackIntentPlaying(true);
    setPlaying(true);
    setReadyPlaybackVideoId("");
  };

  const handlePlayerPause = () => {
    setPlaybackIntentPlaying(false);
    setPlaying(false);
  };

  const handlePlayerError = () => {
    setPlaybackIntentPlaying(false);
    setPlaying(false);
    setError("YouTube 플레이어가 이 음원을 재생하지 못했습니다. 다른 곡을 선택해 주세요.");
  };

  const toggleShuffle = () => {
    setShuffle((value) => !value);
  };

  const toggleRepeatMode = () => {
    setRepeatMode(cycleRepeat);
  };

  const playQueueTrack = (index: number) => {
    const track = queue[index];
    if (!track) return;

    setReadyPlaybackVideoId(track.videoId);
    setPlaying(false);
    setPlaybackIntentPlaying(false);
    setCurrentIndex(index);
  };

  const togglePlaying = () => {
    if (!currentTrack || loadingTrackId) return;

    if (playing) {
      const internalPlayer = playerRef.current?.getInternalPlayer?.();
      internalPlayer?.pauseVideo?.();
      setPlaybackIntentPlaying(false);
      setPlaying(false);
      return;
    }

    const internalPlayer = playerRef.current?.getInternalPlayer?.();
    internalPlayer?.unMute?.();
    internalPlayer?.setVolume?.(100);
    internalPlayer?.playVideo?.();
    setPlaybackIntentPlaying(true);
  };

  const showLogin = () => {
    setAuthOpen(true);
  };

  const closeAuth = () => {
    setAuthOpen(false);
  };

  const toggleAuthMode = () => {
    setAuthMode((value) => (value === "login" ? "signup" : "login"));
  };

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return {
    authLoading,
    authMode,
    authOpen,
    authT,
    closeAuth,
    currentTrack,
    currentUser,
    duration,
    error,
    handleEnded,
    handleDuration,
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
    loadCuratedPlaylistToQueue,
    loadingTrackId,
    locale,
    password,
    playNext,
    playPrevious,
    playQueueTrack,
    playedSeconds,
    playbackIntentPlaying,
    playerRef,
    playing,
    progressPercent,
    playerContextValue: {
      playVibeTrack,
      loadingTrackId,
      queue,
      currentIndex,
      playQueueTrack,
      removeFromQueue,
      loadCuratedPlaylistToQueue,
    },
    repeatMode,
    searchQuery,
    showLogin,
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
  };
};
