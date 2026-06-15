import { searchVibeTracks } from "@/entities/vibe/server/search-vibe-tracks";
import SearchScreen from "@/features/player/ui/SearchScreen";
import type { PageUrlProps } from "@/shared/types/page-url-props";

export const revalidate = 300;

export default async function SearchPage({
  searchParams,
}: PageUrlProps<Record<string, string>, { q?: string }>) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const tracks = query ? await searchVibeTracks(query) : [];

  return <SearchScreen tracks={tracks} query={query} />;
}
