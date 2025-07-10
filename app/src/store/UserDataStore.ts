import { create } from "zustand";
import { BadgeProps, UserData } from "../Types";

type UserDataState = {
  user_id: string | null;
  user_name: string | null;
  profile_image: string | null;
  badge: BadgeProps | null;

  clear: () => void;
  dataInjection: (data: UserData) => void;
};

const useUserDataStore = create<UserDataState>((set) => ({
  user_id: null,
  user_name: null,
  profile_image: null,
  badge: null,

  clear: () =>
    set((state) => ({
      ...state,
      user_id: null,
      user_name: null,
      profile_image: null,
      badge: null,
    })),

  dataInjection: (data: UserData) =>
    set((state) => ({
      ...state,
      ...data,
    })),
}));

export default useUserDataStore;
