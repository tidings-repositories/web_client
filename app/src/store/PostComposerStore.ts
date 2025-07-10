import { create } from "zustand";

type PostComposerState = {
  textContent: string;
  mediaContentList: File[];
  tagList: string[];

  clear: () => void;
  changeTextContent: (detail: string) => void;
  addMediaContent: (mediaContent: FileList) => void;
  removeMediaContent: (idx: number) => void;
  addTag: (tagName: string) => void;
  removeTag: (idx: number) => void;
};

const usePostComposerStore = create<PostComposerState>((set) => ({
  textContent: "",
  mediaContentList: [] as File[],
  tagList: [] as string[],

  clear: () =>
    set((state) => ({
      ...state,
      textContent: "",
      mediaContentList: [],
      tagList: [],
    })),

  changeTextContent: (detail: string) =>
    set((state) => ({
      ...state,
      textContent: detail,
    })),

  addMediaContent: (mediaContent: FileList) =>
    set((state) => ({
      ...state,
      mediaContentList: [...state.mediaContentList, ...mediaContent],
    })),

  removeMediaContent: (idx: number) =>
    set((state) => ({
      ...state,
      mediaContentList: state.mediaContentList.filter((_, i) => i != idx),
    })),

  addTag: (tagName: string) =>
    set((state) => ({
      ...state,
      tagList: [...state.tagList, tagName],
    })),

  removeTag: (idx: number) =>
    set((state) => ({
      ...state,
      tagList: state.tagList.filter((_, i) => i != idx),
    })),
}));

export default usePostComposerStore;
