import * as l10n from "i18next";
import { Post } from "../../Types";
import IconButton from "../button/IconButton";
import Dropdown from "../public/Dropdown";
import Badge from "../profile/Badge";
import PostDropdownItem from "./PostDropdownItem";
import ReactDOM from "react-dom/client";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import PostContext, { PostContextType } from "../../context/PostContext";

function PostInfoBar({ ...info }: Post) {
  const navigator = useNavigate();
  const contentCreateFrom = createTimeDifferenceText(new Date(info.create_at));
  const context = useContext(PostContext);

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
      navigator(`/profile/${info.user_id}`);
    }
  };

  return (
    <div className="flex justify-between">
      <div className="rounded-xs flex justify-start gap-1 items-center">
        <p
          className="font-medium line-clamp-1 select-text cursor-text"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
        >
          {info.user_name}
        </p>
        {info.badge && <Badge {...info.badge} />}
        <div
          className="text-gray-500 select-text cursor-text"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
        >
          @{info.origin ? info.user_id : info.original_user_id}
        </div>
        <div className="mx-2 text-gray-500 font-light">{contentCreateFrom}</div>
      </div>
      <IconButton
        icon="fa-solid fa-ellipsis"
        onPressed={(e) => {
          e.stopPropagation();
          openPostDropdown(e, "post-menu", info.user_id, info.post_id, context);
        }}
      />
    </div>
  );
}

/*------------*/

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

function openPostDropdown(
  e,
  dropdownId,
  userId,
  postId,
  context: PostContextType | null
) {
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
        <PostDropdownItem user_id={userId} post_id={postId} context={context} />
      }
    />
  );
}

export default PostInfoBar;
