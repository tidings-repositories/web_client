import { useEffect } from "react";
import * as l10n from "i18next";
import AppBar from "../components/public/AppBar";
import PostComposerBottomBar from "../components/composer/PostComposerBottomBar";
import PostComposerMedia from "../components/composer/PostComposerMedia";
import PostComposerTagBar from "../components/composer/PostComposerTagBar";
import usePostComposerStore from "../store/PostComposerStore";
import Drawer from "../components/drawer/Drawer";
import RouterDrawerItem from "../components/drawer/RouterDrawerItem";
import useUserDataStore from "../store/UserDataStore";
import { useNavigate } from "react-router-dom";

export default function PostComposer() {
  const MAX_LINE = 10;
  const POST_TEXT_MAXLENGTH = 280;
  const POST_TEXTFIELD_ID = "post-textfield";

  const navigator = useNavigate();
  const userId = useUserDataStore((state) => state.user_id);

  const changeTextState = usePostComposerStore(
    (state) => state.changeTextContent
  );
  const clearComposer = usePostComposerStore((state) => state.clear);

  useEffect(() => {
    if (userId == null) navigator("/");

    clearComposer();
    const textElement = document.getElementById(
      POST_TEXTFIELD_ID
    )! as HTMLTextAreaElement;

    const eventHandler = () => {
      checkTextfieldMaxLine(textElement, MAX_LINE);
    };

    textElement.addEventListener("input", eventHandler);

    return () => textElement.removeEventListener("input", eventHandler);
  }, []);

  return (
    <div id="scaffold" className="w-full h-screen mx-auto content-start">
      <AppBar showSearch={false} showCompmoser={false} showLogin={false} />
      <Drawer child={<RouterDrawerItem />} />
      <div
        id="post-composer"
        className="w-[80vw] h-max px-8 pb-10 mt-14 pt-10 mx-auto flex flex-col gap-4 rounded-xs border-b-2 border-solid border-gray-300"
      >
        {/*텍스트 입력 창*/}
        <textarea
          id={POST_TEXTFIELD_ID}
          name="quick-post-text"
          wrap="hard"
          maxLength={POST_TEXT_MAXLENGTH}
          placeholder={l10n.t("postPlaceholder")}
          rows={10}
          style={{ overflow: "auto" }}
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
    </div>
  );
}

/*----------------*/

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
