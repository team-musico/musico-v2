type ViewMode = "home" | "chart" | "new" | "search" | "playlists" | "queue";

export const viewFromPathname = (pathname: string): ViewMode => {
  if (pathname.startsWith("/chart")) return "chart";
  if (pathname.startsWith("/new")) return "new";
  if (pathname.startsWith("/search")) return "search";
  if (pathname.startsWith("/playlists")) return "playlists";
  if (pathname.startsWith("/queue")) return "queue";
  return "home";
};
