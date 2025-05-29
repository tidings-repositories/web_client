import * as l10n from "i18next";
import { PostInfo } from "../../Types";
import IconButton from "../button/IconButton";
import Dropdown from "../public/Dropdown";
import Badge from "../profile/Badge";
import ReactDOM from "react-dom/client";

function PostInfoBar({ user_name, badge, user_id, create_at }: PostInfo) {
  const contentCreateFrom = createTimeDifferenceText(create_at);

  return (
    <div className="flex justify-between">
      <div className="rounded-xs flex justify-start gap-1 items-center">
        <p className="font-medium line-clamp-1"> {user_name} </p>
        {badge && <Badge {...badge} />}
        <div className="text-gray-500"> @{user_id} </div>
        <div className="mx-3 text-gray-500 font-light">{contentCreateFrom}</div>
      </div>
      <IconButton
        icon="fa-solid fa-ellipsis"
        onPressed={(e) => openPostDropdown(e, "post-menu")}
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

function openPostDropdown(e, dropdownId) {
  const SCREEN_CENTER_POS = window.innerWidth / 2;
  const rect = e.currentTarget.getBoundingClientRect();
  const targetCenterPos = rect.left + rect.width / 2;
  const DIRECTION = SCREEN_CENTER_POS < targetCenterPos ? "LEFT" : "RIGHT";
  const pos = {
    x: DIRECTION === "LEFT" ? rect.right : rect.left,
    y: rect.bottom,
  };

  const newDropdown = document.createElement("div");
  newDropdown.id = `${dropdownId}-box`;
  document.querySelector("body")!.appendChild(newDropdown);
  const root = ReactDOM.createRoot(newDropdown);
  root.render(
    <Dropdown
      id={dropdownId}
      direction={DIRECTION}
      position={pos}
      child={<div className="w-60 h-10 bg-transparent"></div>}
    />
  );
}

export default PostInfoBar;
