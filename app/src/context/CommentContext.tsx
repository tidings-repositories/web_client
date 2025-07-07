import { createContext } from "react";

export type CommentContextType = {
  deleteComment: (commentId: string) => void;
};

const CommentContext = createContext<CommentContextType | null>(null);

export default CommentContext;
