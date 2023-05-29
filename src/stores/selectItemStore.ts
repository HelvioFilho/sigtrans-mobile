import { create } from "zustand";

type items = {
  id: string;
  name: string;
};

type SelectItemStore = {
  selectItem: items[];
  setSelectItem: (data: items[]) => void;
};

export const useSelectItemStore = create<SelectItemStore>((set) => ({
  selectItem: [],
  setSelectItem: (data) => set({ selectItem: data }),
}));
