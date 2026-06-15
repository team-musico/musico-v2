import { createContext } from "react";
import type { MusicPlayerContextValue } from "@/features/player/model/music-player-context-value";

export const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null);
