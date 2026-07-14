import { create } from "zustand";
import { ModalState } from "@/types/modalType";

interface ModalStore {
  modal: ModalState | null;
  isConfirmLoading: boolean;
  open: (modal: ModalState) => void;
  close: () => void;
  setConfirmLoading: (loading: boolean) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  modal: null,
  isConfirmLoading: false,
  open: (modal) => set({ modal, isConfirmLoading: false }),
  close: () => set({ modal: null, isConfirmLoading: false }),
  setConfirmLoading: (loading) => set({ isConfirmLoading: loading }),
}));
