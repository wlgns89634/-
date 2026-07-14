import { create } from "zustand";

interface LoadingState {
  isLoading: boolean;
  message?: string;
  startLoading: (message?: string) => void;
  endLoading: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  message: "처리 중입니다...",
  startLoading: (message) =>
    set({ isLoading: true, message: message ?? "처리 중입니다..." }),
  endLoading: () => set({ isLoading: false }),
}));
