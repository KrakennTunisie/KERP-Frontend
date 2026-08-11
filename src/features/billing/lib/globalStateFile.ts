import { create } from "zustand";
import { persist, PersistStorage, StorageValue } from "zustand/middleware";
import { get, set, del } from "idb-keyval";

interface Store {
  file: File | null;
  fileUrl: string | null;
  setFile: (file: File | null) => void;
  setFileUrl: (url: string | null) => void;
}

// storage custom SANS JSON.stringify — idb-keyval stocke l'objet tel quel (y compris File/Blob)
const indexedDBStorage: PersistStorage<Store> = {
  getItem: async (name: string): Promise<StorageValue<Store> | null> => {
    const value = await get(name);
    return value ?? null;
  },
  setItem: async (name: string, value: StorageValue<Store>): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

export const useInvoiceStore = create<Store>()(
  persist(
    (set) => ({
      file: null,
      fileUrl: null,
      setFile: (file) => set({ file }),
      setFileUrl: (url) => set({ fileUrl: url }),
    }),
    {
      name: "invoice-file-storage",
      storage: indexedDBStorage,
      partialize: (state) => ({ file: state.file, fileUrl: null }) as Store,
      // ne persiste que "file" — fileUrl (blob URL) sera régénéré après reload
      onRehydrateStorage: () => (state) => {
        if (state?.file) {
          const url = URL.createObjectURL(state.file);
          state.setFileUrl(url);
        }
      },
    }
  )
);