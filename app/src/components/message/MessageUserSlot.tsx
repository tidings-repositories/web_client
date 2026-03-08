import { DropdownMenu } from "radix-ui";
import { MessageUserSlotProps } from "../../Types";
import SimpleUserSlot from "../public/SimpleUserSlot";
import IconButton from "../button/IconButton";
import * as l10n from "i18next";
import MessageDropdownItem from "./MessageDropdownItem";

type DirectMessageUserProps = {
  data: MessageUserSlotProps;
  event: (e?: any) => void;
};

function MessageUserSlot({ data, event }: DirectMessageUserProps) {
  return (
    <div
      role="button"
      className="w-full flex flex-col py-2 px-1 rounded-lg hover:bg-gray-100 cursor-pointer"
      onClick={event}
    >
      <div className="flex justify-between">
        <SimpleUserSlot direction="row" {...data.userInfo} />
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
              <MessageDropdownItem dm_id={data.dm_id} />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
      <div className="flex justify-between pl-2 pr-2 gap-2">
        <p
          className="text-gray-500 min-w-0 pl-12"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {data.recentText}
        </p>
        <p className="shrink-0 text-sm text-gray-500">
          {createTimeDifferenceText(data.recentTextTime)}
        </p>
      </div>
    </div>
  );
}

/*----------------*/
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

export default MessageUserSlot;
