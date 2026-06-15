import { NextResponse } from "next/server";
import { getVibeChart } from "@/entities/vibe/server/get-vibe-chart";

export async function GET() {
  try {
    return NextResponse.json(await getVibeChart());
  } catch {
    return NextResponse.json(
      { message: "Error retrieving chart data" },
      { status: 500 },
    );
  }
}
