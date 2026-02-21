import { useState } from "react";
import * as l10n from "i18next";
import { DropdownMenu } from "radix-ui";
import { Post } from "../../Types";
import IconButton from "../button/IconButton";
import Badge from "../profile/Badge";
import PostDropdownItem from "./PostDropdownItem";
import Dialog from "../public/Dialog";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import PostContext from "../../context/PostContext";

function PostInfoBar({ ...info }: Post) {
  const navigator = useNavigate();
  const contentCreateFrom = createTimeDifferenceText(new Date(info.create_at));
  const context = useContext(PostContext);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

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
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger asChild>
          <IconButton
            icon="more"
            onPressed={(e) => e.stopPropagation()}
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            className="py-1 bg-gray-200 z-20 rounded-lg"
          >
            <PostDropdownItem
              user_id={info.user_id}
              post_id={info.post_id}
              context={context}
              onReportSuccess={() => setReportDialogOpen(true)}
            />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <div className="pt-10 pb-20">
          <p className="whitespace-pre-line text-2xl text-center">
            {l10n.t("thanksReport")}
          </p>
        </div>
      </Dialog>
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
