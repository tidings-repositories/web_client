import { DropwdownSlot } from "../public/Dropdown";
import * as l10n from "i18next";

type CommentDropdownItemProps = {
  user_id: string;
  comment_id: string;
};

function CommentDropdownItem({
  user_id,
  comment_id,
}: CommentDropdownItemProps) {
  const userId = "test1"; //TOOD: replace to userid state

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
          //TODO: fetch to report Comment_id
          console.log("report", comment_id);
        }}
      />
      {user_id === userId && (
        <DropwdownSlot
          text={l10n.t("deleteComment")}
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
            //TODO: fetch to DELETE request Comment_id
            console.log("delete", comment_id);
          }}
        />
      )}
    </div>
  );
}

export default CommentDropdownItem;
