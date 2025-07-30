import useUserDataStore from "../../store/UserDataStore";
import { DropwdownSlot } from "../public/Dropdown";
import * as l10n from "i18next";
import iconPack from "../public/IconPack";

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{
              color: "gray",
              width: 16,
              height: 16,
              textAlign: "left",
            }}
          >
            {iconPack("flag")}
          </svg>
        }
        behavior={() => {
          //TODO: fetch to report dm_id
          console.log("report", dm_id);
        }}
      />
      <DropwdownSlot
        text={l10n.t("leaveDM")}
        extraBeforeNode={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{
              color: "gray",
              width: 16,
              height: 16,
              textAlign: "left",
            }}
          >
            {iconPack("signout")}
          </svg>
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
