import { getVibeChart } from "@/entities/vibe/server/get-vibe-chart";
import ChartScreen from "@/features/player/ui/ChartScreen";

export const revalidate = 300;

export default function ChartPage() {
  return <ChartData />;
}

async function ChartData() {
  const tracks = await getVibeChart();
  return <ChartScreen tracks={tracks} />;
}
