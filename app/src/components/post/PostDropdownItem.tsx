import useUserDataStore from "../../store/UserDataStore";
import { DropwdownSlot } from "../public/Dropdown";
import * as l10n from "i18next";

type PostDropdownItemProps = {
  user_id: string;
  post_id: string;
};

function PostDropdownItem({ user_id, post_id }: PostDropdownItemProps) {
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
          //fetch to report post_id
          console.log("report", post_id);
        }}
      />
      {user_id === userId && (
        <DropwdownSlot
          text={l10n.t("deletePost")}
          extraBeforeNode={
            <i
              className="fa-solid fa-trash-can"
              style={{
                fontSize: 14,
                color: "gray",
                width: 20,
                textAlign: "left",
              }}
            ></i>
          }
          behavior={() => {
            //fetch to DELETE request post_id
            console.log("delete", post_id);
          }}
        />
      )}
    </div>
  );
}

export default PostDropdownItem;
