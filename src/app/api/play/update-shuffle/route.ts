import { NextRequest, NextResponse } from "next/server";
import { serializeUser } from "@/entities/legacy/lib/serialize-user";
import { getRequiredLegacyUser } from "@/features/auth/server/get-required-legacy-user";
import { getSupabaseAdmin } from "@/lib/server/supabase-admin";

export async function PATCH(request: NextRequest) {
  const { user, error } = await getRequiredLegacyUser(request);
  if (error) return error;

  const currentPlaying = user.queue?.[user.current_song]?.trackId;
  const isShuffle = !user.is_shuffle;
  const queue = isShuffle
    ? [...(user.original_queue ?? [])].sort(() => Math.random() - 0.5)
    : user.original_queue ?? [];
  const currentSong = currentPlaying
    ? Math.max(
        queue.findIndex((item) => item.trackId === currentPlaying),
        0,
      )
    : 0;

  const { data, error: dbError } = await getSupabaseAdmin()
    .from("musico_users")
    .update({ is_shuffle: isShuffle, queue, current_song: currentSong })
    .eq("id", user.id)
    .select("*")
    .single();

  if (dbError || !data) {
    return NextResponse.json({ message: "SERVER_ERROR" }, { status: 500 });
  }

  return NextResponse.json(serializeUser(data));
}
