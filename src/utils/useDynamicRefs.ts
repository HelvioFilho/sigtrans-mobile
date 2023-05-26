import { RefObject, createRef, useMemo, useRef } from "react";
import { TextInput } from "react-native";

export function useDynamicRefs(ids: string[]): {
  [key: string]: RefObject<TextInput>;
} {
  const refs = useRef<{ [key: string]: RefObject<TextInput> }>({}).current;

  useMemo(() => {
    ids.forEach((id) => {
      if (!refs[id]) {
        refs[id] = createRef<TextInput>();
      }
    });
  }, [ids]);

  return refs;
}
