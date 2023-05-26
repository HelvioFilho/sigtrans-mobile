import { create } from "zustand";
import { getStorage, saveStorage } from "@/utils/storageHelper";
import { ImageSelectedProps } from "@/screens/newScreens/Gallery";

type GalleryStore = {
  galleryData: ImageSelectedProps[];
  setGalleryData: (data: ImageSelectedProps[]) => void;
};

const KEY = "gallery";

const response = getStorage(KEY);
let initialData = response
  ? JSON.parse(response)
  : ([] as ImageSelectedProps[]);

export const useGalleryStore = create<GalleryStore>((set) => ({
  galleryData: initialData,
  setGalleryData: (data) => {
    set(() => {
      saveStorage(KEY, JSON.stringify(data));
      return { galleryData: data };
    });
  },
}));
