import type { RepeatMode } from "@/features/player/model/repeat-mode";

export const cycleRepeat = (mode: RepeatMode): RepeatMode => {
  if (mode === "off") return "all";
  if (mode === "all") return "one";
  return "off";
};
