import { CommentContextType } from "../../context/CommentContext";
import {
  requestDELETEWithToken,
  requestPOSTWithToken,
} from "../../scripts/requestWithToken";
import useUserDataStore from "../../store/UserDataStore";
import { DropwdownSlot } from "../public/Dropdown";
import * as l10n from "i18next";
import iconPack from "../public/IconPack";

type CommentDropdownItemProps = {
  user_id: string;
  comment_id: string;
  context: CommentContextType | null;
  onReportSuccess?: () => void;
};

function CommentDropdownItem({
  user_id,
  comment_id,
  context,
  onReportSuccess,
}: CommentDropdownItemProps) {
  const userId = useUserDataStore((state) => state.user_id);

  return (
    <div className="w-60 flex flex-col gap-1">
      {user_id !== userId && (
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
          behavior={async () => {
            const OK = 200;
            const response = await requestPOSTWithToken(
              `${import.meta.env.VITE_API_URL}/comment/${comment_id}/report`,
              {}
            ).catch((_) => _);

            if (response.status == OK) {
              onReportSuccess?.();
            }
          }}
        />
      )}
      {user_id === userId && (
        <DropwdownSlot
          text={l10n.t("deleteComment")}
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
              {iconPack("trash")}
            </svg>
          }
          behavior={async () => {
            //TODO: fetch to DELETE request Comment_id
            const NO_CONTENT = 204;
            const response = await requestDELETEWithToken(
              `${import.meta.env.VITE_API_URL}/comment/${comment_id}`
            ).catch((_) => _);

            if (response.status == NO_CONTENT && context) {
              context?.deleteComment(comment_id);
            }
          }}
        />
      )}
    </div>
  );
}

export default CommentDropdownItem;
