import useUserDataStore from "../../store/UserDataStore";
import { DropwdownSlot } from "../public/Dropdown";
import * as l10n from "i18next";

type MessageDropdownItemProps = {
  dm_id: string;
};

function MessageDropdownItem({ dm_id }: MessageDropdownItemProps) {
  const userId = useUserDataStore((state) => state.user_id);

  return (
    <div className="w-60 flex flex-col gap-1">
      <DropwdownSlot
        text={l10n.t("report")}
        extraBeforeNode={
          <i
            className="fa-solid fa-flag"
            style={{
              fontSize: 14,
              color: "gray",
              width: 20,
              textAlign: "left",
            }}
          ></i>
        }
        behavior={() => {
          //TODO: fetch to report dm_id
          console.log("report", dm_id);
        }}
      />
      <DropwdownSlot
        text={l10n.t("leaveDM")}
        extraBeforeNode={
          <i
            className="fa-solid fa-arrow-right-from-bracket"
            style={{
              fontSize: 14,
              color: "gray",
              width: 20,
              textAlign: "left",
            }}
          ></i>
        }
        behavior={() => {
          //TODO: fetch to DELETE request dm_id
          console.log("delete", dm_id);
        }}
      />
    </div>
  );
}

export default MessageDropdownItem;
