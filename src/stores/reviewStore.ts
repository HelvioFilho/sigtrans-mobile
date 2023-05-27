import { create } from "zustand";

type ReviewStore = {
  refData: string | undefined;
  setRefData: (ref: string | undefined) => void;
};

export const useReviewStore = create<ReviewStore>((set) => ({
  refData: undefined,
  setRefData: (data) => set(() => ({ refData: data })),
}));
