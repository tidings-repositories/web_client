import { useEffect } from "react";
import Slot from "../components/drawer/Slot";
import useUserDataStore from "../store/UserDataStore";
import * as l10n from "i18next";
import Dialog from "../components/public/Dialog";
import ReactDOM from "react-dom/client";
import DeleteAccount from "../components/sign/DeleteAccount";

export default function Setting() {
  const userId = useUserDataStore((state) => state.user_id);
  const userStoreClear = useUserDataStore((state) => state.clear);

  useEffect(() => {
    if (userId == null) window.location.href = "/";
  }, []);

  return (
    <>
      <div id="setting" className="flex flex-col">
        {userId && (
          <Slot
            icon="fa-solid fa-arrow-right-from-bracket"
            text={l10n.t("signOut")}
            behavior={() => {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");

              userStoreClear();

              window.location.href = "/";
            }}
          />
        )}
        {/*
          사용자 이용 약관
          개인정보 보호정책
          쿠폰 사용
        */}
        {userId && (
          <Slot
            icon="fa-solid fa-user-large-slash"
            text={l10n.t("deleteAccount")}
            color="red"
            behavior={openDialog}
          />
        )}
      </div>
    </>
  );
}

/*---------------*/

function openDialog() {
  const newDialog = document.createElement("div");
  newDialog.id = `dialog-box`;
  document.querySelector("body")!.appendChild(newDialog);
  const root = ReactDOM.createRoot(newDialog);
  root.render(<Dialog child={<DeleteAccount />} />);
}
