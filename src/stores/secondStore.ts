import { AdditionalDataDTO } from "@/dtos/AdditionalDataDTO";
import { LocationDTO } from "@/dtos/LocationDTO";
import { SelectItemProps } from "@/screens/newScreens/SecondInformation";
import { getStorage, saveStorage } from "@/utils/storageHelper";
import { create } from "zustand";

type SecondDataProps = AdditionalDataDTO &
  LocationDTO & {
    observations: string;
    checkList: SelectItemProps[];
  };

type SecondStore = {
  secondData: SecondDataProps;
  setSecondData: (data: SecondDataProps) => void;
};

const KEY = "secondInformation";

const response = getStorage(KEY);
let initialData = response ? JSON.parse(response) : ({} as SecondDataProps);

export const useSecondStore = create<SecondStore>((set) => ({
  secondData: initialData,
  setSecondData: (data) => {
    set(() => {
      saveStorage(KEY, JSON.stringify(data));
      return { secondData: data };
    });
  },
}));
