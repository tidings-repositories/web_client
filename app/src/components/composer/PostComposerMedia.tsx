import { PostMediaStructure } from "../../Types";
import MediaContent from "../post/MediaContent";
import IconButton from "../button/IconButton";
import usePostComposerStore from "../../store/PostComposerStore";

function PostComposerMedia() {
  const QUICK_POST_MEDIAFIELD_ID = "quick-post-media";
  const childMediaContext = { index: 0 };
  const mediaFiles = usePostComposerStore((state) => state.mediaContentList);
  const removeMediaFile = usePostComposerStore(
    (state) => state.removeMediaContent
  );

  return (
    <div id={QUICK_POST_MEDIAFIELD_ID} className="bg-transparent">
      {/*delete media button*/}
      {mediaFiles.length != 0 && (
        <div className="absolute bg-transparent w-5 h-5 z-1 ml-4 mt-4">
          <IconButton
            icon="fa-solid fa-xmark-circle"
            size="xl"
            onPressed={() => removeMediaFile(childMediaContext.index)}
          />
        </div>
      )}
      {mediaFiles.length != 0 && (
        <MediaContent
          contents={mediaFiles.map((file) => {
            return {
              url: fileToURL(file),
              type: file.type.split("/")[0],
            } as PostMediaStructure;
          })}
          context={childMediaContext}
          post_id="mediafield"
        />
      )}
    </div>
  );
}

/*--------------*/

function fileToURL(file: File) {
  return URL.createObjectURL(file);
}

export default PostComposerMedia;
