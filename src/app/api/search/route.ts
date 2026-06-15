import { NextRequest, NextResponse } from "next/server";
import { Innertube, UniversalCache } from "youtubei.js";
import type { Track } from "@/entities/track/model/track";
import type { SearchResponse } from "@/features/search/model/search-response";

export const runtime = "nodejs";

type Candidate = {
  videoId: string;
  title: string;
  thumbnail?: string;
  duration?: string;
};
type SearchSuccess = {
  track: Track;
  candidates: SearchResponse["candidates"];
};

let youtubePromise: Promise<Innertube> | null = null;
const responseCache = new Map<string, SearchSuccess>();
const embeddableCache = new Map<string, Promise<boolean>>();

function getYoutube() {
  youtubePromise ??= Innertube.create({
    cache: new UniversalCache(false),
    generate_session_locally: true,
  });

  return youtubePromise;
}

function createCacheKey(artist: string, title: string) {
  return `${normalize(artist)}::${normalize(title)}`;
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readText(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && "text" in value) {
    const text = (value as { text?: unknown }).text;
    return typeof text === "string" ? text : "";
  }
  return "";
}

function readVideoId(value: unknown): string {
  if (!value || typeof value !== "object") return "";
  const item = value as Record<string, unknown>;
  const id = item.id;
  if (typeof id === "string") return id;
  if (id && typeof id === "object" && "video_id" in id) {
    const videoId = (id as { video_id?: unknown }).video_id;
    return typeof videoId === "string" ? videoId : "";
  }
  const videoId = item.video_id;
  return typeof videoId === "string" ? videoId : "";
}

function mapCandidate(value: unknown): Candidate | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const videoId = readVideoId(value);
  const title = readText(item.title);
  if (!videoId || !title) return null;

  const thumbnails = item.thumbnails as Array<{ url?: string }> | undefined;
  const thumbnail = thumbnails?.at(-1)?.url;
  const duration = readText(item.duration);

  return { videoId, title, thumbnail, duration };
}

async function fetchEmbeddable(videoId: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2_500);

  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(
        `https://www.youtube.com/watch?v=${videoId}`,
      )}&format=json`,
      {
        next: { revalidate: 60 * 60 * 24 * 7 },
        signal: controller.signal,
      },
    );

    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

function isEmbeddable(videoId: string) {
  const cached = embeddableCache.get(videoId);
  if (cached) return cached;

  const promise = fetchEmbeddable(videoId);
  embeddableCache.set(videoId, promise);

  return promise;
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    artist?: string;
    title?: string;
  } | null;

  const artist = body?.artist?.trim();
  const title = body?.title?.trim();

  if (!artist || !title) {
    return NextResponse.json(
      { error: "아티스트명과 노래 제목을 모두 입력해 주세요." },
      { status: 400 },
    );
  }

  const cacheKey = createCacheKey(artist, title);
  const cached = responseCache.get(cacheKey);
  if (cached) return NextResponse.json(cached);

  const query = `${artist} ${title} lyrics`;
  const youtube = await getYoutube();
  const results = await youtube.search(query, { type: "video" });
  const rawVideos = (results as unknown as { videos?: unknown[] }).videos ?? [];
  const candidates = rawVideos.map(mapCandidate).filter(Boolean) as Candidate[];

  const normalizedArtist = normalize(artist);
  const normalizedTitle = normalize(title);
  const inspected = candidates.slice(0, 12).map((candidate) => {
    const normalizedCandidateTitle = normalize(candidate.title);
    const matchedArtist = normalizedCandidateTitle.includes(normalizedArtist);
    const matchedTitle = normalizedCandidateTitle.includes(normalizedTitle);

    return {
      videoId: candidate.videoId,
      title: candidate.title,
      matchedArtist,
      matchedTitle,
      embeddable: false,
    };
  }) satisfies SearchResponse["candidates"];

  const embeddableResults = await Promise.all(
    inspected.map((candidate) =>
      candidate.matchedArtist && candidate.matchedTitle
        ? isEmbeddable(candidate.videoId)
        : Promise.resolve(false),
    ),
  );

  const verifiedCandidates = inspected.map((candidate, index) => ({
    ...candidate,
    embeddable: embeddableResults[index] ?? false,
  })) satisfies SearchResponse["candidates"];

  for (const candidate of candidates.slice(0, 12)) {
    const inspectedCandidate = verifiedCandidates.find(
      (item) => item.videoId === candidate.videoId,
    );

    if (
      inspectedCandidate?.matchedArtist &&
      inspectedCandidate.matchedTitle &&
      inspectedCandidate.embeddable
    ) {
      const track: Track = {
        id: crypto.randomUUID(),
        videoId: candidate.videoId,
        title,
        artist,
        requestedTitle: title,
        thumbnail: candidate.thumbnail,
        duration: candidate.duration,
        sourceTitle: candidate.title,
        url: `https://www.youtube.com/watch?v=${candidate.videoId}`,
      };

      const payload = { track, candidates: verifiedCandidates };
      responseCache.set(cacheKey, payload);

      return NextResponse.json(payload);
    }
  }

  return NextResponse.json(
    {
      error:
        "재생 가능 여부와 제목 검증을 모두 통과한 음원을 찾지 못했습니다.",
      candidates: verifiedCandidates,
    },
    { status: 404 },
  );
}
