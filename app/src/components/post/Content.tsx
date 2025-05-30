import { Post, PostInfo } from "../../Types";
import MediaContent from "./MediaContent";
import PostInfoBar from "./PostInfoBar";
import PostBottomBar from "./PostBottomBar";
import MiniProfile from "../public/MiniProfile";
import Tag from "./Tag";

function Content(post: Post) {
  const mediaCount = post.content.media.length ?? 0;

  return (
    <div className="flex justify-start items-start gap-2 rounded-xs my-3 px-8">
      <MiniProfile user_id={post.user_id} img_url={post.profile_image} />
      <div className="w-full flex flex-col justify-start gap-2">
        <PostInfoBar {...(post as PostInfo)} />
        <p className="line-clamp-6" style={{ whiteSpace: "pre-wrap" }}>
          {post.content.text}
        </p>
        {mediaCount >= 1 && (
          <MediaContent contents={post.content.media} post_id={post.post_id} />
        )}
        <div className="w-full flex flex-wrap gap-2 item-start">
          {post.content.tag.map((text, idx) => (
            <div key={`${post.post_id}${text}${idx}`} className="relative">
              <Tag content={text} />
            </div>
          ))}
        </div>
        <PostBottomBar
          comment_count={post.comment_count}
          like_count={post.like_count}
          scrap_count={post.scrap_count}
        />
      </div>
    </div>
  );
}

export default Content;
