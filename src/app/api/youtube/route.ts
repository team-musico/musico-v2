import { NextRequest, NextResponse } from "next/server";
import { Innertube, UniversalCache } from "youtubei.js";

export const runtime = "nodejs";

let youtubePromise: Promise<Innertube> | null = null;

function getYoutube() {
  youtubePromise ??= Innertube.create({
    cache: new UniversalCache(false),
    generate_session_locally: true,
  });
  return youtubePromise;
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

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    query?: string;
  } | null;
  const query = body?.query?.trim();

  if (!query) {
    return NextResponse.json({ message: "QUERY_REQUIRED" }, { status: 400 });
  }

  const youtube = await getYoutube();
  const results = await youtube.search(`${query} lyrics 가사`, {
    type: "video",
  });
  const videos = ((results as unknown as { videos?: unknown[] }).videos ?? [])
    .map(readVideoId)
    .filter(Boolean)
    .slice(0, 3);

  return NextResponse.json(videos);
}
