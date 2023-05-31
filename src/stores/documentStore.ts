import { create } from "zustand";

type DocumentStore = {
  idData: string;
  setIdData: (id: string) => void;
};

export const useDocumentStore = create<DocumentStore>((set) => ({
  idData: "",
  setIdData: (idData) => set(() => ({ idData })),
}));
