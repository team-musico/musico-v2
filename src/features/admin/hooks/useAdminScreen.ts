import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import type { AdminPlaylist } from "@/entities/playlist/model/admin-playlist";
import type { VibeTrack } from "@/entities/track/model/vibe-track";
import { vibeSongsApi } from "@/entities/vibe/api/vibe-songs-api";
import { adminPlaylistsApi } from "@/features/admin/api/admin-playlists-api";
import { authApi } from "@/features/auth/api/auth-api";
import { playerApi } from "@/features/player/api/player-api";
import { adminArtistNames } from "@/features/admin/utils/adminArtistNames";
import { adminErrorMessage } from "@/features/admin/utils/adminErrorMessage";

export const useAdminScreen = () => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [playlists, setPlaylists] = useState<AdminPlaylist[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<VibeTrack[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedPlaylist = useMemo(
    () => playlists.find((playlist) => playlist.id === selectedPlaylistId),
    [playlists, selectedPlaylistId],
  );

  const loadPlaylists = useCallback(async (token = accessToken) => {
    if (!token) return;
    setLoading(true);
    setMessage("");

    try {
      const { response, payload } = await adminPlaylistsApi.list(token);
      if (!response.ok || !Array.isArray(payload)) {
        throw new Error(
          adminErrorMessage("message" in payload ? payload.message : undefined) ??
            "관리자 플레이리스트를 불러오지 못했습니다.",
        );
      }

      setPlaylists(payload);
      setSelectedPlaylistId((current) => current || payload[0]?.id || "");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "요청에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    const bootstrapAdmin = async () => {
      const token = window.localStorage.getItem("musico-access-token") ?? "";
      if (!token) {
        router.replace("/auth?next=/admin");
        return;
      }

      setLoading(true);
      setMessage("");

      try {
        const { response, user } = await authApi.me(token);

        if (!response.ok) {
          window.localStorage.removeItem("musico-access-token");
          window.localStorage.removeItem("musico-refresh-token");
          router.replace("/auth?next=/admin");
          return;
        }

        if (user?.role !== "admin") {
          router.replace("/");
          return;
        }

        setAccessToken(token);
        setAuthorized(true);
        await loadPlaylists(token);
      } catch {
        setMessage("관리자 권한을 확인하지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    bootstrapAdmin();
  }, [loadPlaylists, router]);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const createPlaylist = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;

    const { response, payload } = await adminPlaylistsApi.create(accessToken, title, description);
    if (!response.ok) {
      setMessage(adminErrorMessage(payload?.message) ?? "플레이리스트 생성 실패");
      return;
    }

    setTitle("");
    setDescription("");
    await loadPlaylists();
  };

  const deletePlaylist = async (playlistId: string) => {
    const { response, payload } = await adminPlaylistsApi.remove(accessToken, playlistId);
    if (!response.ok) {
      setMessage(adminErrorMessage(payload?.message) ?? "플레이리스트 삭제 실패");
      return;
    }

    setSelectedPlaylistId("");
    await loadPlaylists();
  };

  const searchSongs = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;
    setLoading(true);

    try {
      const { response, payload } = await vibeSongsApi.search(query);
      if (!response.ok || !Array.isArray(payload)) {
        throw new Error("곡 검색 실패");
      }
      setResults(payload);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "곡 검색 실패");
    } finally {
      setLoading(false);
    }
  };

  const addSong = async (track: VibeTrack) => {
    if (!selectedPlaylistId) return;
    setLoading(true);
    setMessage("");

    try {
      const { response: searchResponse, payload: searchPayload } = await playerApi.resolvePlayableTrack(
        adminArtistNames(track),
        track.title,
      );

      if (!searchResponse.ok || !("track" in searchPayload) || !searchPayload.track?.videoId) {
        const message = "error" in searchPayload ? searchPayload.error : undefined;
        throw new Error(message ?? "재생 가능한 영상을 찾지 못했습니다.");
      }

      const { response, payload } = await adminPlaylistsApi.addSong(
        accessToken,
        selectedPlaylistId,
        track,
        searchPayload.track.videoId,
      );

      if (!response.ok) {
        throw new Error(adminErrorMessage(payload?.message) ?? "곡 추가 실패");
      }

      await loadPlaylists();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "곡 추가 실패");
    } finally {
      setLoading(false);
    }
  };

  const removeSong = async (trackId: number) => {
    if (!selectedPlaylistId) return;

    const { response, payload } = await adminPlaylistsApi.removeSong(accessToken, selectedPlaylistId, trackId);
    if (!response.ok) {
      setMessage(adminErrorMessage(payload?.message) ?? "곡 삭제 실패");
      return;
    }

    await loadPlaylists();
  };

  return {
    addSong,
    authorized,
    createPlaylist,
    deletePlaylist,
    description,
    handleDescriptionChange,
    handleQueryChange,
    handleTitleChange,
    loading,
    message,
    playlists,
    query,
    removeSong,
    results,
    searchSongs,
    selectedPlaylist,
    selectedPlaylistId,
    setSelectedPlaylistId,
    title,
  };
};
