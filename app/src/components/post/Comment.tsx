import { useContext, useEffect, useState } from "react";
import { CommentProps, UserData } from "../../Types";
import MiniProfile from "../public/MiniProfile";
import Badge from "../profile/Badge";
import IconButton from "../button/IconButton";
import MixedButton from "../button/MixedButton";
import CommentDropdownItem from "./CommentDropdownItem";
import OutlineButton from "../button/OutlineButton";
import Dropdown from "../public/Dropdown";
import ReactDOM from "react-dom/client";
import * as l10n from "i18next";
import useUserDataStore from "../../store/UserDataStore";
import { requestPOSTWithToken } from "../../scripts/requestWithToken";
import CommentContext from "../../context/CommentContext";

function Comment({ ...data }: CommentProps) {
  const userId = useUserDataStore((state) => state.user_id);
  const userName = useUserDataStore((state) => state.user_name);
  const profileImage = useUserDataStore((state) => state.profile_image);
  const badge = useUserDataStore((state) => state.badge);

  const context = useContext(CommentContext);

  const [replyAvailable, setState] = useState(false);
  const [replies, setReplyState] = useState([
    ...(data.reply ?? []),
  ] as CommentProps[]);

  const deleteComment = (commentId: string) => {
    setReplyState((prev) =>
      prev.filter((state) => state.comment_id !== commentId)
    );
  };

  const commentCreateFrom = createTimeDifferenceText(new Date(data.create_at));
  const REPLY_TEXT_MAXLENGTH = 100;
  const REPLY_TEXTFIELD_ID = `${data.comment_id}-reply-textfield`;

  return (
    (!data.deleted || data.reply!.length > 0) && (
      <div className="w-full h-full flex flex-col gap-2">
        {/*comment*/}
        <div className="w-full max-w-200 flex gap-2 box-border">
          {/*MiniProfile / comment height line*/}
          <div className="flex flex-col items-center">
            <MiniProfile user_id={data.user_id} img_url={data.profile_image} />
            <div className="w-4 h-full mr-2 rounded-bl-xl border-l-2 border-b-2 border-gray-300 self-end"></div>
          </div>
          {/*name, id, createAt, option / text*/}
          <div className="w-full p-* flex flex-col gap-2">
            {data.deleted ? (
              <div className="pt-1" />
            ) : (
              <div className="flex justify-between">
                <div id="comment-user-info" className="flex gap-1 items-center">
                  <p className="font-medium line-clamp-1 select-text cursor-text">
                    {data.user_name}
                  </p>
                  {data.badge && <Badge {...data.badge} />}
                  <p className="text-gray-500 select-text cursor-text">
                    @{data.user_id}
                  </p>
                  <div className="mx-3 text-gray-500 font-light">
                    {commentCreateFrom}
                  </div>
                </div>
                <IconButton
                  icon="fa-solid fa-ellipsis"
                  onPressed={(e) => {
                    openCommentDropdown(
                      e,
                      "comment-menu",
                      data.user_id,
                      data.comment_id,
                      context
                    );
                  }}
                />
              </div>
            )}
            <p
              className="break-words"
              style={{
                wordBreak: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "pre-wrap",
              }}
            >
              {data.text}
            </p>
            {/*Reply 상호작용*/}
            {data.root && (
              <div className="w-full flex">
                <MixedButton
                  icon="fa-solid fa-comment"
                  gap={2}
                  text={"reply"}
                  onPressed={() => setState((state) => !state)}
                />
              </div>
            )}
          </div>
        </div>

        {/*reply textarea*/}
        {userId && replyAvailable && (
          <div
            id={`${data.comment_id}-reply-input`}
            className="flex gap-2 w-full max-w-200 h-40 py-3 px-4 mx-auto border-2 border-gray-400 rounded-xl items-start"
          >
            {/*미니 프로필*/}
            <div className="min-w-12 items-center">
              <MiniProfile user_id={userId} img_url={profileImage ?? ""} />
            </div>
            {/*flex flex-col 코멘트 textarea, 코멘트 버튼*/}
            <div className="flex flex-col w-full h-full">
              <div className="w-full h-full">
                <textarea
                  id={REPLY_TEXTFIELD_ID}
                  name="reply-text"
                  wrap="hard"
                  maxLength={REPLY_TEXT_MAXLENGTH}
                  rows={3}
                  style={{ overflow: "auto" }}
                  className="w-full h-full text-base py-1"
                  onChange={(e) => checkTextfieldMaxLine(e.target, 10)}
                ></textarea>
              </div>
              <div className="self-end items-center">
                <OutlineButton
                  text={"reply"}
                  color="gray"
                  fontSize="base"
                  backgroundColor="gray"
                  fontColor="white"
                  radius={16}
                  onPressed={() => {
                    const tempCommentId = (
                      214252112123 * Math.random()
                    ).toString();

                    const textarea = document.getElementById(
                      REPLY_TEXTFIELD_ID
                    ) as HTMLTextAreaElement;
                    const replyData = textarea.value.trim();
                    textarea.value = "";

                    const postBottomCommentCountElement = document
                      .getElementById(`${data.post_id}-bottom-bar`)
                      ?.querySelector(".fa-solid.fa-comment")
                      ?.closest("div")
                      ?.querySelector("p");

                    const postReply = async () => {
                      const CREATED = 201;

                      const response = await requestPOSTWithToken(
                        `${import.meta.env.VITE_API_URL}/comment/${
                          data.post_id
                        }/${data.comment_id}`,
                        { text: replyData }
                      ).catch((_) => _);

                      //낙관적 업데이트 롤백
                      if (response.status != CREATED) {
                        setReplyState((state) =>
                          state.filter((e) => e.comment_id != tempCommentId)
                        );

                        if (postBottomCommentCountElement) {
                          postBottomCommentCountElement.textContent = (
                            +postBottomCommentCountElement.textContent! - 1
                          ).toString();
                        }

                        return;
                      }
                    };

                    //코멘트 수 낙관적 업데이트
                    if (postBottomCommentCountElement) {
                      postBottomCommentCountElement.textContent = (
                        +postBottomCommentCountElement.textContent! + 1
                      ).toString();
                    }

                    //TODO fetch (reply + userState + posdId) @@@
                    postReply();

                    //reply 낙관적 업데이트
                    setReplyState((state) => {
                      const newReply = {
                        comment_id: tempCommentId,
                        user_id: userId,
                        user_name: userName,
                        badge: badge,
                        create_at: new Date(Date.now()),
                        root: false,
                        post_id: data.post_id,
                        profile_image: profileImage,
                        text: replyData,
                        deleted: false,
                        reply: null,
                      } as CommentProps;

                      return [...state, newReply];
                    });

                    setState((state) => !state);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/*replies*/}
        <CommentContext.Provider value={{ deleteComment }}>
          <div id="reply-area" className="flex flex-col pl-10 gap-1">
            {data.root &&
              data.reply &&
              replies.map((rep, idx) => (
                <Comment key={`${data.comment_id}-reply-${idx}`} {...rep} />
              ))}
          </div>
        </CommentContext.Provider>
      </div>
    )
  );
}

/*-------------------*/
const dayPerSecond = 86400;
const hourPerSecond = 3600;
const minutePerSecond = 60;

function createTimeDifferenceText(createAt: Date) {
  const timePerSecond = (new Date().getTime() - createAt.getTime()) / 1000;

  if (timePerSecond < 1) return "1" + l10n.t("secondUnit");

  if (timePerSecond > dayPerSecond) {
    let dateText = `${createAt.getMonth() + 1}.${createAt.getDate()}`;
    if (new Date().getFullYear() != createAt.getFullYear())
      dateText = `${createAt.getFullYear()} ` + dateText;
    return dateText;
  } else if (timePerSecond <= minutePerSecond) {
    return Math.floor(timePerSecond).toString() + l10n.t("secondUnit");
  } else if (timePerSecond <= hourPerSecond) {
    return (
      Math.floor(timePerSecond / minutePerSecond).toString() +
      l10n.t("minuteUnit")
    );
  } else {
    return (
      Math.floor(timePerSecond / hourPerSecond).toString() + l10n.t("hourUnit")
    );
  }
}

function openCommentDropdown(e, dropdownId, userId, commentId, context) {
  const rect = e.currentTarget.getBoundingClientRect();
  const pos = {
    x: rect.right,
    y: rect.bottom,
  };

  const newDropdown = document.createElement("div");
  newDropdown.id = `${dropdownId}-box`;

  document.querySelector("body")!.appendChild(newDropdown);
  const root = ReactDOM.createRoot(newDropdown);
  root.render(
    <Dropdown
      id={dropdownId}
      position={pos}
      child={
        <CommentDropdownItem
          user_id={userId}
          comment_id={commentId}
          context={context}
        />
      }
    />
  );
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

export default Comment;
