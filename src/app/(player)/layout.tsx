import MusicStudio from "@/widgets/music-player/ui/music-studio";

export default function PlayerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MusicStudio>{children}</MusicStudio>;
}
