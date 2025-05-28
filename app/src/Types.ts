/*post*/
type MediaType = "image" | "video";

export type PostMediaStructure = {
  type: MediaType;
  url: string;
};

export type PostInfo = {
  user_name: string;
  badge: string | null;
  user_id: string;
  create_at: Date;
};

export type PostBottom = {
  comment_count: number;
  like_count: number;
  scrap_count: number;
};

export type Post = {
  post_id: string;
  user_id: string;
  user_name: string;
  profile_image: string; // url
  badge: string | null;
  create_at: Date;
  content: {
    text: string;
    media: PostMediaStructure[];
    tag: string[];
  };
  comment_count: number;
  like_count: number;
  scrap_count: number;
};

/*profile*/

export type UserData = {
  user_id: string;
  user_name: string;
  bio: string;
  profile_image: string;
  badge: string;
  following_count: number;
  follower_count: number;
};
