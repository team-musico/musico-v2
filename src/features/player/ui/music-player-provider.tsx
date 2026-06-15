"use client";

import type { ReactNode } from "react";
import { MusicPlayerContext } from "@/features/player/model/music-player-context";
import type { MusicPlayerContextValue } from "@/features/player/model/music-player-context-value";

const MusicPlayerProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: MusicPlayerContextValue;
}) => {
  return <MusicPlayerContext.Provider value={value}>{children}</MusicPlayerContext.Provider>;
};

export default MusicPlayerProvider;
