import { NextResponse } from "next/server";
import { getVibeNewSongs } from "@/entities/vibe/server/get-vibe-new-songs";

export async function GET() {
  try {
    return NextResponse.json(await getVibeNewSongs());
  } catch {
    return NextResponse.json(
      { message: "Error retrieving new song data" },
      { status: 500 },
    );
  }
}
