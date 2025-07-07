import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CommentProps } from "../../Types";
import MiniProfile from "../public/MiniProfile";
import Badge from "../profile/Badge";
import * as l10n from "i18next";

function ProfileComment({ ...data }: CommentProps) {
  const [comment] = useState({
    ...data,
  } as CommentProps);
  const navigator = useNavigate();

  const commentCreateFrom = createTimeDifferenceText(
    new Date(comment.create_at)
  );

  return (
    <div
      role="button"
      className="w-full h-full flex flex-col gap-4 py-4 px-1 cursor-pointer hover:bg-gray-100"
      onClick={() => navigator(`/post/${data.post_id}`)}
    >
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
        </div>
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

export default ProfileComment;
