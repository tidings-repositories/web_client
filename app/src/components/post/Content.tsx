import { Post, PostBottom } from "../../Types";
import MediaContent from "./MediaContent";
import PostInfoBar from "./PostInfoBar";
import PostBottomBar from "./PostBottomBar";
import MiniProfile from "../public/MiniProfile";
import Tag from "./Tag";
import { useNavigate } from "react-router-dom";
import MixedButton from "../button/MixedButton";

function Content(post: Post) {
  if (!post.content) post.content = { text: "", media: [], tag: [] };
  const mediaCount = post.content.media ? post.content.media.length : 0;
  const navigator = useNavigate();

  let isDragging = false;
  const handleMouseDown = () => {
    isDragging = false;
  };
  const handleMouseMove = () => {
    isDragging = true;
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isDragging) {
      navigator(`/post/${post.post_id}`, { state: post });
    }
  };

  return (
    <div
      role="button"
      className="cursor-pointer"
      onClick={() =>
        navigator(`/post/${post.post_id}`, {
          state: post,
        })
      }
    >
      <div className="w-full flex flex-col gap-1 rounded-xs py-3 px-8 hover:bg-gray-100">
        {!post.origin && (
          <MixedButton
            icon="fa-solid fa-repeat"
            text={`clipped by @${post.user_id}`}
            onPressed={() => navigator(`/profile/${post.user_id}`)}
            gap={2}
          />
        )}
        <div className="flex justify-start items-start gap-2 rounded-xs">
          <MiniProfile
            user_id={post.origin ? post.user_id : post.original_user_id!}
            img_url={post.profile_image}
          />
          <div className="w-full flex flex-col justify-start gap-2">
            <PostInfoBar {...post} />
            <p
              className="line-clamp-6 select-text cursor-text"
              style={{ whiteSpace: "pre-wrap" }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onClick={handleClick}
            >
              {post.content.text}
            </p>
            {mediaCount >= 1 && (
              <MediaContent
                contents={post.content.media}
                post_id={post.post_id}
              />
            )}
            <div className="w-full flex flex-wrap gap-2 item-start">
              {post.content.tag.map((text, idx) => (
                <div key={`${post.post_id}${text}${idx}`} className="relative">
                  <Tag content={text} />
                </div>
              ))}
            </div>
            <PostBottomBar {...(post as PostBottom)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Content;
