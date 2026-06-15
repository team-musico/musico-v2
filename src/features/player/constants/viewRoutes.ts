type ViewMode = "home" | "chart" | "new" | "search" | "playlists" | "queue";

export const VIEW_ROUTES: Record<ViewMode, string> = {
  home: "/",
  chart: "/chart",
  new: "/new",
  search: "/search",
  playlists: "/playlists",
  queue: "/queue",
};
