import { useEffect } from "react";
import * as l10n from "i18next";
import IconButton from "../button/IconButton";
import OutlineButton from "../button/OutlineButton";
import usePostComposerStore from "../../store/PostComposerStore";

type PostDataProps = {
  textContent: string;
  mediaFiles: File[];
  tags: string[];
};

function PostComposerBottomBar() {
  const POST_TAG_MAXLENGTH = 20;
  const addTag = usePostComposerStore((state) => state.addTag);
  const addMediaFile = usePostComposerStore((state) => state.addMediaContent);
  const postComposerState = usePostComposerStore((state) => state);

  useEffect(() => {
    const parentElement = document.getElementById(`tag-textfield-box`)!;
    const textElement = parentElement.querySelector(`#tag-textfield`)!;
    const clearButtonIconElement = parentElement.querySelector("i")!;
    clearButtonIconElement.style.color = "transparent";

    textElement.addEventListener("input", (e) =>
      changeViewStateClearButtonEvent(e, clearButtonIconElement)
    );
    return () =>
      textElement.removeEventListener("input", (e) =>
        changeViewStateClearButtonEvent(e, clearButtonIconElement)
      );
  });

  return (
    <div className="w-full h-10 mx-auto flex rounded-xs border-solid border-gray-300 items-center">
      {/*바텀 바 (미디어 데이터 탐색 아이콘 버튼, 태그(게임) 선택, 포스팅 버튼)*/}
      <div className="mr-auto flex gap-2">
        <input
          type="file"
          id="fileSearch"
          multiple
          className="hidden"
          onChange={(e) => {
            const newFile = e.target.files ?? [];
            if (
              newFile.length != 0 &&
              postComposerState.mediaContentList.length < 4
            ) {
              addMediaFile(newFile as FileList);
            }
          }}
        />
        <IconButton
          icon="fa-solid fa-image"
          onPressed={() => document.getElementById("fileSearch")!.click()}
        />
        <IconButton
          icon="fa-solid fa-hashtag"
          onPressed={() => controlTagTextfieldWidthEvent(`tag-textfield-box`)}
        />
        {/*태그 입력창*/}
        <div
          id={`tag-textfield-box`}
          className="pl-2 pr-1 flex rounded-lg border-2 border-solid border-transparent overflow-hidden transition-all duration-300 ease-in-out w-0"
        >
          <form
            id={`tag-textfield`}
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const detail = (formData.get("tag") as string) ?? "";
              if (detail.trim() !== "" && postComposerState.tagList.length < 5)
                addTag(detail);
              e.currentTarget.reset();
              e.currentTarget.dispatchEvent(
                new Event("input", { bubbles: true })
              );
            }}
          >
            <input
              type="text"
              maxLength={POST_TAG_MAXLENGTH}
              name="tag"
              className="m-0 p-0 w-full h-full"
            />
          </form>
          {/*textfield clear button*/}
          <IconButton
            icon="fa-solid fa-xmark"
            onPressed={() => {
              const tagTextfield = document.getElementById(
                `tag-textfield`
              ) as HTMLFormElement;
              tagTextfield.reset();
              tagTextfield.dispatchEvent(new Event("input", { bubbles: true }));
            }}
          />
        </div>
      </div>
      <OutlineButton
        fontSize="base"
        color="gray-300"
        text={`${l10n.t("upload")}`}
        radius="lg"
        onPressed={async () => {
          await uploadPostContent({
            textContent: postComposerState.textContent,
            mediaFiles: postComposerState.mediaContentList,
            tags: postComposerState.tagList,
          });
        }}
      />
    </div>
  );
}

/*-------------------*/

function controlTagTextfieldWidthEvent(target_id: string) {
  const boxElement = document.getElementById(target_id)!;
  const currentWidth = boxElement.style.width;
  const extend = "140px";

  if (currentWidth.startsWith(extend)) {
    boxElement.style.width = "0px";
    boxElement.style.borderColor = "transparent";
  } else {
    boxElement.style.borderColor = "gray";
    boxElement.style.width = extend;
  }
}

function changeViewStateClearButtonEvent(
  event: Event,
  clearButtonIconElement: HTMLElement
) {
  const EMPTY = "";
  const TEXT = (event.target as HTMLInputElement).value;
  if (TEXT == EMPTY || !TEXT) {
    clearButtonIconElement!.style.color = "transparent";
  } else {
    clearButtonIconElement!.style.color = "gray";
  }
}

async function uploadPostContent({
  textContent,
  mediaFiles,
  tags,
}: PostDataProps) {
  console.log(textContent, mediaFiles, tags);
}

export default PostComposerBottomBar;
