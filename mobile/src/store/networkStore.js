import { create } from 'zustand';

export const useNetworkStore = create((set, get) => ({
  isOnline: true,
  isSimulatedOffline: false,

  setOnlineStatus: (status) => set({ isOnline: status }),

  toggleSimulatedOffline: () => {
    const next = !get().isSimulatedOffline;
    set({ isSimulatedOffline: next, isOnline: !next });
  },
}));
