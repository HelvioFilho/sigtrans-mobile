import { create } from "zustand";
import { ACCESSORY } from "@/utils/defaultData";

type items = {
  id: string;
  name: string;
};

type SelectItemStore = {
  selectItem: items[];
  setSelectItem: (data: items[]) => void;
};

let initialData = ACCESSORY;

export const useSelectItemStore = create<SelectItemStore>((set) => ({
  selectItem: initialData,
  setSelectItem: (data) => set({ selectItem: data }),
}));
