import { createContext } from "react";

export type PostContextType = {
  deletePost: (postId: string) => void;
};

const PostContext = createContext<PostContextType | null>(null);

export default PostContext;
