import * as l10n from "i18next";
import { PostInfo } from "../../Types";

function PostInfoBar({ user_name, badge, user_id, create_at }: PostInfo) {
  const contentCreateFrom = createTimeDifferenceText(create_at);

  return (
    <div className="rounded-xs flex justify-start gap-1 items-center">
      <p className="font-medium line-clamp-1"> {user_name} </p>
      {badge && <img className="max-w-5 max-h-5" src={badge} />}
      <div className="text-gray-500"> {user_id} </div>
      <div className="mx-3 text-gray-500 font-light">{contentCreateFrom}</div>
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

export default PostInfoBar;
