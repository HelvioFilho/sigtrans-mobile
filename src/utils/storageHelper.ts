import uuid from "react-native-uuid";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV({ id: "sigtrans@storage" });

type SyncLaterImagesProps = {
  [key: string]: string[];
};

export function saveStorage(key: string, value: string) {
  storage.set(key, value);
}

export function getStorage(key: string) {
  return storage.getString(key);
}

export function removeStorage(key: string) {
  storage.delete(key);
}

export function saveImageToSyncLater(value: SyncLaterImagesProps) {
  const alreadyExists = getStorage("syncLaterImages");
  if (alreadyExists) {
    const oldImages = JSON.parse(alreadyExists);
    const combinedImages = {
      ...oldImages,
      ...value,
    };
    saveStorage("syncLaterImages", JSON.stringify(combinedImages));
  } else {
    saveStorage("syncLaterImages", JSON.stringify(value));
  }
}

export function generateId() {
  const alreadyExists = getStorage("id");
  if (!alreadyExists) {
    const id = uuid.v4();
    saveStorage("id", JSON.stringify(id));
    return id;
  }
  return JSON.parse(alreadyExists);
}
