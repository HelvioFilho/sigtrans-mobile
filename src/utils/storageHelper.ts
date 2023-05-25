import uuid from "react-native-uuid";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV({ id: "sigtrans@storage" });

export function saveStorage(key: string, value: string) {
  storage.set(key, value);
}

export function getStorage(key: string) {
  return storage.getString(key);
}
