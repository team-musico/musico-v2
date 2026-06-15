import { NextRequest, NextResponse } from "next/server";
import { searchVibeTracks } from "@/entities/vibe/server/search-vibe-tracks";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();
  if (!query) {
    return NextResponse.json({ message: "QUERY_REQUIRED" }, { status: 400 });
  }

  try {
    return NextResponse.json(await searchVibeTracks(query));
  } catch {
    return NextResponse.json(
      { message: "Error retrieving search data" },
      { status: 500 },
    );
  }
}
