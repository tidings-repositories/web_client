import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { UserData } from "../Types";

type FollowingUserState = {
  followingIdTable: { [key: string]: boolean } | null;

  clear: () => void;
  add: (publicId: string) => void;
  remove: (publicId: string) => void;
  dataInjection: (data: UserData[]) => void;
};

const useFollowingUserStore = create<FollowingUserState>()(
  immer((set) => ({
    followingIdTable: null,

    clear: () =>
      set((state) => {
        state.followingIdTable = {};
      }),
    add: (publicId) =>
      set((state) => {
        if (!state.followingIdTable) return;
        state.followingIdTable[publicId] = true;
      }),
    remove: (publicId) =>
      set((state) => {
        if (!state.followingIdTable) return;
        state.followingIdTable[publicId] = false;
      }),
    dataInjection: (data: UserData[]) =>
      set((state) => {
        if (data.length == 0 && state.followingIdTable == null)
          state.followingIdTable = {};

        data.forEach((thisUser) => {
          state.followingIdTable ??= {};
          state.followingIdTable[thisUser.user_id] = true;
        });
      }),
  }))
);

export default useFollowingUserStore;
