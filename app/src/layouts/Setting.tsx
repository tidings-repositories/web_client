import { useEffect } from "react";
import Slot from "../components/drawer/Slot";
import useUserDataStore from "../store/UserDataStore";
import * as l10n from "i18next";
import Dialog from "../components/public/Dialog";
import ReactDOM from "react-dom/client";
import DeleteAccount from "../components/sign/DeleteAccount";
import AppBar from "../components/public/AppBar";
import Drawer from "../components/drawer/Drawer";
import RouterDrawerItem from "../components/drawer/RouterDrawerItem";
import { useNavigate } from "react-router-dom";
import UseCoupon from "../components/setting/UseCoupon";

export default function Setting() {
  const userId = useUserDataStore((state) => state.user_id);
  const userStoreClear = useUserDataStore((state) => state.clear);

  const navigator = useNavigate();

  useEffect(() => {
    if (userId == null) window.location.href = "/";
  }, []);

  return (
    <div id="scaffold" className="w-full h-screen mx-auto content-start">
      <AppBar
        showSearch={false}
        showMessage={false}
        showNoti={false}
        showCompmoser={false}
      />
      <Drawer child={<RouterDrawerItem />} />
      <div id="setting" className="flex flex-col gap-2 px-4 pt-20 pb-10">
        <Slot
          icon="fa-solid fa-ticket-simple"
          text={l10n.t("coupon")}
          behavior={openCouponDialog}
        />
        <Slot
          icon="fa-solid fa-clipboard-user"
          text={l10n.t("userAgreement")}
          behavior={() => navigator("/setting/user-agreement")}
        />
        <Slot
          icon="fa-solid fa-lock"
          text={l10n.t("privacyPolicy")}
          behavior={() => navigator("/setting/privacy-policy")}
        />
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
        {userId && (
          <Slot
            icon="fa-solid fa-user-large-slash"
            text={l10n.t("deleteAccount")}
            color="red"
            behavior={openDeleteAccountDialog}
          />
        )}
      </div>
    </div>
  );
}

/*---------------*/

function openCouponDialog() {
  const newDialog = document.createElement("div");
  newDialog.id = `dialog-box`;
  document.querySelector("body")!.appendChild(newDialog);
  const root = ReactDOM.createRoot(newDialog);
  root.render(<Dialog child={<UseCoupon />} />);
}

function openDeleteAccountDialog() {
  const newDialog = document.createElement("div");
  newDialog.id = `dialog-box`;
  document.querySelector("body")!.appendChild(newDialog);
  const root = ReactDOM.createRoot(newDialog);
  root.render(<Dialog child={<DeleteAccount />} />);
}
