import type { Track } from "@/entities/track/model/track";

type StoredState = {
  queue: Track[];
};

export const readStoredState = (storageKey: string): StoredState => {
  if (typeof window === "undefined") {
    return {
      queue: [],
    };
  }

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    return {
      queue: [],
    };
  }

  try {
    const parsed = JSON.parse(raw) as StoredState;
    return {
      queue: parsed.queue ?? [],
    };
  } catch {
    return {
      queue: [],
    };
  }
};
