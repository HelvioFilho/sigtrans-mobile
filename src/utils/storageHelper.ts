import uuid from "react-native-uuid";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV({ id: "sigtrans@storage" });

export function saveStorage(key: string, value: string) {
  storage.set(key, value);
}

export function getStorage(key: string) {
  return storage.getString(key);
}

export function removeStorage(key: string) {
  storage.delete(key);
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
