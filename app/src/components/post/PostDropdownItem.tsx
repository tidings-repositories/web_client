import { PostContextType } from "../../context/PostContext";
import {
  requestDELETEWithToken,
  requestPOSTWithToken,
} from "../../scripts/requestWithToken";
import useUserDataStore from "../../store/UserDataStore";
import { DropwdownSlot } from "../public/Dropdown";
import * as l10n from "i18next";
import ReactDOM from "react-dom/client";
import Dialog from "../public/Dialog";
import iconPack from "../public/IconPack";

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
  const admin = "Stellagram";
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
              <use xlinkHref={`#flag`} />
            </svg>
          }
          behavior={async () => {
            const OK = 200;
            const response = await requestPOSTWithToken(
              `${import.meta.env.VITE_API_URL}/post/${post_id}/report`,
              {}
            ).catch((_) => _);

            if (response.status == OK) {
              const dropdownCloseEvent = new MouseEvent("mousedown", {
                bubbles: true,
              });
              document.dispatchEvent(dropdownCloseEvent);

              openDialog();
            }
          }}
        />
      )}
      {(user_id === userId || userId == admin) && (
        <DropwdownSlot
          text={l10n.t("deletePost")}
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
              <use xlinkHref={`#trash`} />
            </svg>
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

            const path = window.location.pathname.split("/");
            if (path[path.length - 2] == "post") history.back();
          }}
        />
      )}
    </div>
  );
}

function openDialog() {
  const newDialog = document.createElement("div");
  newDialog.id = `dialog-box`;
  document.querySelector("body")!.appendChild(newDialog);
  const root = ReactDOM.createRoot(newDialog);
  root.render(
    <Dialog
      child={
        <div className="pt-10 pb-20">
          <p className="whitespace-pre-line text-2xl text-center">
            {l10n.t("thanksReport")}
          </p>
        </div>
      }
    />
  );
}

export default PostDropdownItem;
