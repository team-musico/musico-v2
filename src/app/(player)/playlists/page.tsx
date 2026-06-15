import { getAdminPlaylists } from "@/lib/server/admin-playlists";
import PlaylistsScreen from "@/features/player/ui/PlaylistsScreen";

export const revalidate = 60;

export default function PlaylistsPage() {
  return <PlaylistsData />;
}

async function PlaylistsData() {
  const playlists = await getAdminPlaylists();
  return <PlaylistsScreen playlists={playlists} />;
}
