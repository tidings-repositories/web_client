import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Post } from "../Types";

type LikePostState = {
  likePostTable: { [key: string]: boolean } | null;

  clear: () => void;
  add: (postId: string) => void;
  remove: (postId: string) => void;
  dataInjection: (data: Post[]) => void;
};

const useLikePostStore = create<LikePostState>()(
  immer((set) => ({
    likePostTable: null,

    clear: () =>
      set((state) => {
        state.likePostTable = {};
      }),
    add: (postId) =>
      set((state) => {
        if (!state.likePostTable) return;
        state.likePostTable[postId] = true;
      }),
    remove: (postId) =>
      set((state) => {
        if (!state.likePostTable) return;
        state.likePostTable[postId] = false;
      }),
    dataInjection: (data: Post[]) =>
      set((state) => {
        if (data.length == 0 && state.likePostTable == null)
          state.likePostTable = {};

        data.forEach((thisPost) => {
          state.likePostTable ??= {};
          state.likePostTable[thisPost.post_id] = true;
        });
      }),
  }))
);

export default useLikePostStore;
