import { create } from "zustand";

export const PlayState = {
  PLAYING: "PLAYING",
  PAUSED: "PAUSED",
  STOPPED: "STOPPED",
} as const;

export type PlayState = (typeof PlayState)[keyof typeof PlayState];

interface PlayStore {
  playState: PlayState;
  setPlayState: (state: PlayState) => void;
}

const usePlay = create<PlayStore>((set) => ({
  playState: "STOPPED",
  setPlayState: (state) => set({ playState: state }),
}));

export default usePlay;
