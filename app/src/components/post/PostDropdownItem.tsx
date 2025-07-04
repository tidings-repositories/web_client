import { PostContextType } from "../../context/PostContext";
import { requestDELETEWithToken } from "../../scripts/requestWithToken";
import useUserDataStore from "../../store/UserDataStore";
import { DropwdownSlot } from "../public/Dropdown";
import * as l10n from "i18next";

type PostDropdownItemProps = {
  user_id: string;
  post_id: string;
  context: PostContextType | null;
};

function PostDropdownItem({
  user_id,
  post_id,
  context,
}: PostDropdownItemProps) {
  const userId = useUserDataStore((state) => state.user_id);

  return (
    <div className="w-60 flex flex-col gap-1">
      {user_id !== userId && (
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
            //TODO: fetch to report post_id
            console.log("report", post_id);
          }}
        />
      )}
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
          behavior={async () => {
            const NO_CONTENT = 204;
            const response = await requestDELETEWithToken(
              `${import.meta.env.VITE_API_URL}/post/${post_id}`
            ).catch((_) => _);

            if (response.status == NO_CONTENT && context) {
              context.deletePost(post_id);

              const dropdownCloseEvent = new MouseEvent("mousedown", {
                bubbles: true,
              });
              document.dispatchEvent(dropdownCloseEvent);
            }
          }}
        />
      )}
    </div>
  );
}

export default PostDropdownItem;
