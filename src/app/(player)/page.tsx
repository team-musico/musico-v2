import { getVibeChart } from "@/entities/vibe/server/get-vibe-chart";
import { getVibeNewSongs } from "@/entities/vibe/server/get-vibe-new-songs";
import HomeScreen from "@/features/player/ui/HomeScreen";

export const revalidate = 300;

export default function HomePage() {
  return <HomeData />;
}

async function HomeData() {
  const [chartTracks, newTracks] = await Promise.all([
    getVibeChart(),
    getVibeNewSongs(),
  ]);

  return <HomeScreen chartTracks={chartTracks} newTracks={newTracks} />;
}
