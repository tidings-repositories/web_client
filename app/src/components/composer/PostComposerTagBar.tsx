import IconButton from "../button/IconButton";
import usePostComposerStore from "../../store/PostComposerStore";
import Tag from "../post/Tag";

function PostComposerTagBar() {
  const POST_TAGFIELD_ID = "post-tag";
  const tagList = usePostComposerStore((state) => state.tagList);
  const removeTag = usePostComposerStore((state) => state.removeTag);

  return (
    <div
      className="w-full flex flex-wrap gap-2 item-start"
      id={POST_TAGFIELD_ID}
    >
      {/*TODO: 태그 마다 제거 버튼 및 이벤트*/}
      {tagList.map((content, idx) => (
        <div key={`${content}${idx}`} className="relative">
          {/*delete tag button*/}
          <div className="absolute bg-transparent w-1 h-1 z-1 -top-3 -left-3">
            <IconButton
              icon="fa-solid fa-xmark-circle"
              size={16}
              onPressed={() => removeTag(idx)}
            />
          </div>

          <Tag content={content as string} />
        </div>
      ))}
    </div>
  );
}

export default PostComposerTagBar;
