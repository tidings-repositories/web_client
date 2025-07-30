import { useEffect } from "react";
import * as l10n from "i18next";
import IconButton from "../button/IconButton";
import OutlineButton from "../button/OutlineButton";
import usePostComposerStore from "../../store/PostComposerStore";
import { PostMediaStructure } from "../../Types";
import { requestPOSTWithToken } from "../../scripts/requestWithToken";
import axios from "axios";

let fetchState = false;

type PostDataProps = {
  textContent: string;
  mediaFiles: File[];
  tags: string[];
  clearFunc: () => void;
};

function PostComposerBottomBar() {
  const MB = 1024 * 1024;
  const POST_TAG_MAXLENGTH = 20;
  const addTag = usePostComposerStore((state) => state.addTag);
  const addMediaFile = usePostComposerStore((state) => state.addMediaContent);
  const clearComposer = usePostComposerStore((state) => state.clear);
  const postComposerState = usePostComposerStore((state) => state);

  useEffect(() => {
    const parentElement = document.getElementById(`tag-textfield-box`)!;
    const textElement = parentElement.querySelector(`#tag-textfield`)!;
    const clearButtonIconElement = parentElement.querySelector("button")!;
    clearButtonIconElement.style.display = "none";

    const eventHandler = (e: Event) =>
      changeViewStateClearButtonEvent(e, clearButtonIconElement);
    textElement.addEventListener("input", eventHandler);
    return () => textElement.removeEventListener("input", eventHandler);
  }, []);

  return (
    <div className="w-full h-10 mx-auto flex rounded-xs border-solid border-gray-300 items-center">
      {/*바텀 바 (미디어 데이터 탐색 아이콘 버튼, 태그(게임) 선택, 포스팅 버튼)*/}
      <div className="mr-auto flex gap-2">
        <input
          type="file"
          id="fileSearch"
          className="hidden"
          onChange={(e) => {
            const newFile = e.target.files ?? [];
            if (
              newFile.length != 0 &&
              postComposerState.mediaContentList.length < 5
            ) {
              if (newFile[0].size < 5 * MB) addMediaFile(newFile as FileList);
              else alert("5MB 이하의 미디어 파일만 포함할 수 있습니다.");
            }
          }}
        />
        <IconButton
          icon="image"
          onPressed={() => document.getElementById("fileSearch")!.click()}
        />
        <IconButton
          icon="hashtag"
          onPressed={() => controlTagTextfieldWidthEvent(`tag-textfield-box`)}
        />
        {/*태그 입력창*/}
        <div
          id={`tag-textfield-box`}
          className="h-9 pl-2 pr-1 flex items-center rounded-lg border-2 border-solid border-transparent overflow-hidden transition-all duration-300 ease-in-out w-0"
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
            icon="xmark"
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
        color="gray" //TODO: 컬러 테마 설정
        text={`${l10n.t("upload")}`}
        radius={12}
        onPressed={() =>
          uploadPostContent({
            textContent: postComposerState.textContent,
            mediaFiles: postComposerState.mediaContentList,
            tags: postComposerState.tagList,
            clearFunc: clearComposer,
          })
        }
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
    clearButtonIconElement!.style.display = "none"; //color = "transparent";
  } else {
    clearButtonIconElement!.style.display = "block"; //color = "gray";
  }
}

async function uploadPostContent({
  textContent,
  mediaFiles,
  tags,
  clearFunc,
}: PostDataProps) {
  const OK = 200;
  const CREATED = 201;
  if (textContent.trim() == "" && mediaFiles.length == 0) return;
  const mediaList: PostMediaStructure[] = [];
  if (mediaFiles.length != 0) {
    const contentTypeList = mediaFiles.map((file) => file.type);

    const presignedResponse = await requestPOSTWithToken(
      `${import.meta.env.VITE_API_URL}/storage/api/upload/post`,
      {
        "content-types": contentTypeList,
      }
    ).catch((_) => _);
    if (presignedResponse.status != OK) return;

    const presignedUrls = presignedResponse.data.presignedUrls;
    if (presignedUrls == null || presignedUrls.length == 0) return;

    let mediaUploadErrorFlag = false;
    const promises = presignedUrls.map((url, idx) =>
      axios
        .put(url, mediaFiles[idx], {
          headers: { "Content-Type": contentTypeList[idx] },
        })
        .catch((e) => {
          mediaUploadErrorFlag = true;
        })
    );

    await Promise.all(promises);
    if (mediaUploadErrorFlag) return;
    mediaList.push(
      ...presignedUrls.map((link, idx) => ({
        type: contentTypeList[idx].split("/")[0],
        url: link,
      }))
    );
  }

  //포스트 생성 요청

  if (!fetchState) {
    throttle();

    const response = await requestPOSTWithToken(
      `${import.meta.env.VITE_API_URL}/post`,
      {
        text: textContent,
        media: mediaList,
        tag: tags,
      }
    ).catch((_) => _);

    clearFunc();
    if (response.status == CREATED && window.location.pathname != "/")
      window.history.back();
    else if (response.status == CREATED && window.location.pathname == "/")
      window.location.reload();
  }
}

function throttle() {
  fetchState = true;
  setTimeout(() => {
    fetchState = false;
  }, 5000);
}

export default PostComposerBottomBar;
