import { useEffect } from "react";
import * as l10n from "i18next";
import PostComposerBottomBar from "./PostComposerBottomBar";
import PostComposerMedia from "./PostComposerMedia";
import PostComposerTagBar from "./PostComposerTagBar";
import usePostComposerStore from "../../store/PostComposerStore";

function QuickPostComposer() {
  const MAX_LINE = 10;
  const POST_TEXT_MAXLENGTH = 280;
  const QUICK_POST_TEXTFIELD_ID = "quick-post-textfield";

  const changeTextState = usePostComposerStore(
    (state) => state.changeTextContent
  );
  const clearComposer = usePostComposerStore((state) => state.clear);

  useEffect(() => {
    clearComposer();
    const textElement = document.getElementById(
      QUICK_POST_TEXTFIELD_ID
    )! as HTMLTextAreaElement;

    const eventHandler = () => {
      textfieldResizeEvent(textElement);
      checkTextfieldMaxLine(textElement, MAX_LINE);
    };

    textElement.addEventListener("input", eventHandler);

    return () => {
      textElement.removeEventListener("input", eventHandler);
    };
  }, []);

  return (
    <div className="w-[97vw] max-w-173 min-h-39.25 px-8 pb-2 pt-4 mx-auto flex flex-col gap-2 rounded-xs border-b-2 border-solid border-gray-300">
      {/*텍스트 입력 창*/}
      <textarea
        id={QUICK_POST_TEXTFIELD_ID}
        name="quick-post-text"
        wrap="hard"
        maxLength={POST_TEXT_MAXLENGTH}
        placeholder={l10n.t("postPlaceholder")}
        className="min-h-25 text-xl"
        onChange={(e) => changeTextState(e.target.value)}
      ></textarea>
      {/*미디어 존*/}
      <PostComposerMedia />
      {/*태그 바*/}
      <PostComposerTagBar />
      {/*바텀 바 (미디어 데이터 탐색 아이콘 버튼, 태그 입력, 포스팅 버튼)*/}
      <PostComposerBottomBar />
    </div>
  );
}

/*----------------*/

function textfieldResizeEvent(textarea: HTMLElement) {
  if (textarea.scrollHeight >= window.innerHeight / 2) {
    textarea.style.overflow = "auto";
  } else {
    textarea.style.overflow = "none";
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }
}

function checkTextfieldMaxLine(
  textarea: HTMLTextAreaElement,
  MAX_LINE_COUNT: number
) {
  const line = textarea.value.split("\n");
  if (line.length > MAX_LINE_COUNT) {
    line[MAX_LINE_COUNT - 1] = `${line[MAX_LINE_COUNT - 1]}${
      line[MAX_LINE_COUNT]
    }`;
    textarea.value = line.slice(0, MAX_LINE_COUNT).join("\n");
  }
}

export default QuickPostComposer;
