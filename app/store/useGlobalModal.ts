import { create } from 'zustand';

type ModalType = 'alert' | 'confirm';

interface ModalContent {
  type: ModalType;
  title: string;
  description?: string;
}

interface GlobalModalStore {
  isOpen: boolean;
  content: ModalContent | null;
  resolver: ((value: boolean) => void) | null;
  open: (content: ModalContent) => Promise<boolean>;
  close: (result: boolean) => void;
}

export const useGlobalModal = create<GlobalModalStore>()((set, get) => ({
  isOpen: false,
  content: null,
  resolver: null,
  open: (content) => {
    return new Promise<boolean>((resolve) => {
      set({
        isOpen: true,
        content,
        resolver: resolve,
      });
    });
  },
  close: (result) => {
    const { resolver } = get();
    resolver?.(result);

    set({
      isOpen: false,
      content: null,
      resolver: null,
    });
  },
}));
