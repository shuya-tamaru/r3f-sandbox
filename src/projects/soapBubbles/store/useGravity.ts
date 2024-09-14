import { create } from "zustand";

type UseGravityState = {
  gravity: boolean;
  setGravity: (gravity: boolean) => void;
};

export const useGravity = create<UseGravityState>((set) => ({
  gravity: false,
  setGravity: (gravity) => set({ gravity }),
}));
