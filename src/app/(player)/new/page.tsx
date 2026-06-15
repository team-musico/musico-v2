import { getVibeNewSongs } from "@/entities/vibe/server/get-vibe-new-songs";
import NewSongsScreen from "@/features/player/ui/NewSongsScreen";

export const revalidate = 300;

export default function NewSongsPage() {
  return <NewSongsData />;
}

async function NewSongsData() {
  const tracks = await getVibeNewSongs();
  return <NewSongsScreen tracks={tracks} />;
}
