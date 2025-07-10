import MessageUserSlot from "./MessageUserSlot";
import { MessageUserSlotProps } from "../../Types";
import * as l10n from "i18next";
import { useNavigate } from "react-router-dom";

type MessageListProps = {
  directMessages: MessageUserSlotProps[];
  selectedIdx: number | null;
  stateDispatcher: React.Dispatch<React.SetStateAction<number | null>>;
};

function MessageList({
  directMessages,
  selectedIdx,
  stateDispatcher,
}: MessageListProps) {
  const navigator = useNavigate();

  const selectDirectMessageEvent = (
    dmInfo: MessageUserSlotProps,
    idx: number
  ) => {
    navigator(`/message/${dmInfo.dm_id}`, { replace: true });
    stateDispatcher(() => idx);
  };

  return (
    <div
      id="message-list"
      className="min-w-120 max-w-120 h-full flex flex-col justify-start items-center gap-2 pb-4 mx-auto"
    >
      <div className="w-full p-2">
        <p className="text-2xl font-semibold">{l10n.t("message")}</p>
      </div>
      <div className="flex flex-col gap-2 w-full px-1">
        {directMessages.map((dm, idx) => (
          <div key={dm.dm_id} className="relative w-full h-full">
            <MessageUserSlot
              data={dm}
              event={() => selectDirectMessageEvent(dm, idx)}
            />
            <div
              id={`frame${idx}`}
              className={`absolute top-0 w-1 h-full z-1 ${
                selectedIdx == idx ? "bg-yellow-300" : ""
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MessageList;
