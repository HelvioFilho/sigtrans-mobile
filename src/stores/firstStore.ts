import { create } from "zustand";
import { getStorage, removeStorage, saveStorage } from "@/utils/storageHelper";

import { VehicleDTO } from "@/dtos/VehicleDTO";
import { TowTruckDTO } from "@/dtos/TowTruckDTO";
import { RetentionParkDTO } from "@/dtos/RetentionParkDTO";

type FirstDataProps = RetentionParkDTO & TowTruckDTO & VehicleDTO;

type FirstStore = {
  firstData: Partial<FirstDataProps>;
  setFirstData: (data: Partial<FirstDataProps>) => void;
  deleteFirstData: () => void;
};

const KEY = "firstInformation";

const response = getStorage(KEY);
let initialData = response
  ? JSON.parse(response)
  : ({} as Partial<FirstDataProps>);

export const useFirstStore = create<FirstStore>((set) => ({
  firstData: initialData,
  setFirstData: (data) => {
    set(() => {
      saveStorage(KEY, JSON.stringify(data));
      return { firstData: data };
    });
  },
  deleteFirstData: () => {
    set(() => {
      removeStorage(KEY);
      return { firstData: {} };
    });
  },
}));
