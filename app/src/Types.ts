/*post*/
type MediaType = "image" | "video";

export type PostMediaStructure = {
  type: MediaType;
  url: string;
};

export type PostBottom = {
  origin: boolean;
  post_id: string;
  user_id: string;
  comment_count: number;
  like_count: number;
  scrap_count: number;
};

export type Post = {
  post_id: string;
  user_id: string;
  user_name: string;
  profile_image: string; // url
  badge: BadgeProps | null;
  create_at: Date;
  content: {
    text: string;
    media: PostMediaStructure[];
    tag: string[];
  };
  comment_count: number;
  like_count: number;
  scrap_count: number;
  origin: boolean;

  original_post_id?: string | null;
  original_user_id?: string | null;

  like_at?: Date | null;
};

export type CommentProps = {
  post_id: string;
  comment_id: string;
  user_id: string;
  user_name: string;
  badge: BadgeProps | null;
  profile_image: string;
  create_at: Date;
  text: string;
  root: boolean;
  deleted: boolean | null;
  root_comment_id?: string;
  reply?: CommentProps[] | null;
};

/*profile*/
export type BadgeProps = {
  id: number;
  name: string;
  url: string;
};

export type UserData = {
  user_id: string;
  user_name: string;
  bio: string;
  profile_image: string;
  badge: BadgeProps | null;
  following_count: number;
  follower_count: number;
};

/*notification*/
export type NotificationType = "comment" | "scrap" | "like" | "follow";

export type NotificationData = {
  type: NotificationType;
  detail: string;
  published_by: string;
  published_at: Date;
};

/*message*/
export type MessageUserSlotProps = {
  userInfo: UserData;
  dm_id: string;
  recentText: string;
  recentTextTime: Date;
};

export type MessageProps = {
  dm_id: string;
  user_id: string;
  send_at: Date;
  text?: string;
  image?: string;
};
