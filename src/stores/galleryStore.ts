import { create } from "zustand";
import { generateId, getStorage, saveStorage } from "@/utils/storageHelper";
import { ImageSelectedProps } from "@/screens/newScreens/Gallery";

type GalleryStore = {
  galleryData: ImageSelectedProps[];
  setGalleryData: (data: ImageSelectedProps[]) => void;
  cleanGalleryData: () => void;
};
const id = generateId();
const KEY = `gallery_${id}`;

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
  cleanGalleryData: () => {
    set({ galleryData: [] });
  },
}));
