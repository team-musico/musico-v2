"use client";

import { useContext } from "react";
import { MusicPlayerContext } from "@/features/player/model/music-player-context";

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);

  if (!context) {
    throw new Error("useMusicPlayer must be used inside MusicPlayerProvider");
  }

  return context;
};
