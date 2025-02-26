import { Post, PostInfo } from "../../Types";
import MediaContent from "./MediaContent";
import PostInfoBar from "./PostInfoBar";
import PostBottomBar from "./PostBottomBar";

function Content(post: Post) {
  return (
    <div className="w-screen max-w-173 flex justify-start gap-2 rounded-xs m-3 pl-8 pr-8 overflow-hidden">
      <img className="rounded-xl max-w-10 max-h-10" src={post.profile_image} />
      <div className="w-full flex flex-col justify-start gap-2">
        <PostInfoBar {...(post as PostInfo)} />
        <p className="line-clamp-6">{post.content.text}</p>
        <MediaContent contents={post.content.media} post_id={post.post_id} />
        <PostBottomBar comment_count={1} like_count={201} scrap_count={0} />
      </div>
    </div>
  );
}

export default Content;
