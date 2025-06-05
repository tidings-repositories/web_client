import { useState } from "react";
import { CommentProps } from "../../Types";
import MiniProfile from "../public/MiniProfile";
import Badge from "../profile/Badge";
import IconButton from "../button/IconButton";
import MixedButton from "../button/MixedButton";
import CommentDropdownItem from "./CommentDropdownItem";
import OutlineButton from "../button/OutlineButton";
import Dropdown from "../public/Dropdown";
import ReactDOM from "react-dom/client";
import * as l10n from "i18next";

import { createMockProfile } from "../../../dev/mockdata";

function Comment({ ...data }: CommentProps) {
  const [replyAvailable, setState] = useState(false);
  const [comment, setCommentState] = useState({
    ...data,
  } as CommentProps);
  const myUserData = createMockProfile(); //TODO: replace to user state
  const userId = myUserData.user_id; //TODO: replace to userId state

  const commentCreateFrom = createTimeDifferenceText(comment.create_at);
  const REPLY_TEXT_MAXLENGTH = 100;
  const REPLY_TEXTFIELD_ID = `${comment.comment_id}-reply-textfield`;

  return (
    <div className="w-full h-full flex flex-col gap-4 py-2">
      {/*comment*/}
      <div className="w-full max-w-200 flex gap-2 box-border">
        {/*MiniProfile / comment height line*/}
        <div className="flex flex-col items-center">
          <MiniProfile
            user_id={comment.user_id}
            img_url={comment.profile_image}
          />
          <div className="w-4 h-full mr-2 rounded-bl-xl border-l-2 border-b-2 border-gray-300 self-end"></div>
        </div>
        {/*name, id, createAt, option / text*/}
        <div className="w-full p-* flex flex-col gap-2">
          <div className="flex justify-between">
            <div id="comment-user-info" className="flex gap-1 items-center">
              <p className="font-medium line-clamp-1 select-text cursor-text">
                {comment.user_name}
              </p>
              {comment.badge && <Badge {...comment.badge} />}
              <p className="text-gray-500 select-text cursor-text">
                @{comment.user_id}
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
                  comment.user_id,
                  comment.comment_id
                );
              }}
            />
          </div>
          <p
            className="break-words"
            style={{
              wordBreak: "break-word",
              overflowWrap: "break-word",
              whiteSpace: "pre-wrap",
            }}
          >
            {comment.text}
          </p>
          {/*Reply 상호작용*/}
          {comment.origin && (
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
          id={`${comment.comment_id}-reply-input`}
          className="flex gap-2 w-full max-w-200 h-40 py-3 px-4 mx-auto border-2 border-gray-400 rounded-xl items-start"
        >
          {/*미니 프로필*/}
          <div className="min-w-12 items-center">
            <MiniProfile
              user_id={myUserData.user_id}
              img_url={myUserData.profile_image}
            />
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
                  const textarea = document.getElementById(
                    REPLY_TEXTFIELD_ID
                  ) as HTMLTextAreaElement;
                  const replyData = textarea.value.trim();
                  textarea.value = "";

                  //TODO fetch (reply + userState + posdId) @@@

                  //reply 낙관적 업데이트
                  const newReply = {
                    comment_id: (214252112123 * Math.random()).toString(),
                    user_id: userId,
                    user_name: myUserData.user_name,
                    badge: myUserData.badge,
                    create_at: new Date(Date.now()),
                    origin: false,
                    post_id: comment.post_id,
                    profile_image: myUserData.profile_image,
                    text: replyData,
                    reply: null,
                  } as CommentProps;
                  setCommentState((state) => {
                    const newReplies = [...(state.reply ?? []), newReply];

                    return {
                      ...state,
                      reply: newReplies,
                    };
                  });

                  //코멘트 수 낙관적 업데이트
                  const postBottomCommentCountElement = document
                    .getElementById(`${comment.post_id}-bottom-bar`)
                    ?.querySelector(".fa-solid.fa-comment")
                    ?.closest("div")
                    ?.querySelector("p");
                  if (postBottomCommentCountElement) {
                    postBottomCommentCountElement.textContent = (
                      +postBottomCommentCountElement.textContent! + 1
                    ).toString();
                  }

                  setState((state) => !state);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/*replies*/}
      <div id="reply-area" className="flex flex-col pl-10">
        {comment.origin &&
          comment.reply &&
          comment.reply.map((rep, idx) => (
            <Comment key={`${comment.comment_id}-reply-${idx}`} {...rep} />
          ))}
      </div>
    </div>
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

function openCommentDropdown(e, dropdownId, userId, commentId) {
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
      child={<CommentDropdownItem user_id={userId} comment_id={commentId} />}
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
