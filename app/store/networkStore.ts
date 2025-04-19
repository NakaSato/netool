import { create } from "zustand";

interface NetworkState {
  address: string;
  mask: string;
  setAddress: (address: string) => void;
  setMask: (mask: string) => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  address: "",
  mask: "",
  setAddress: (address) => set({ address }),
  setMask: (mask) => set({ mask }),
}));
