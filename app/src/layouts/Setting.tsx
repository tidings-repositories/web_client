import { useState } from "react";
import Slot from "../components/drawer/Slot";
import useUserDataStore from "../store/UserDataStore";
import * as l10n from "i18next";
import Dialog from "../components/public/Dialog";
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

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [couponDialogOpen, setCouponDialogOpen] = useState(false);
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);

  return (
    <div id="scaffold" className="w-full h-screen mx-auto content-start">
      <AppBar
        showSearch={false}
        showMessage={false}
        showNoti={false}
        showCompmoser={false}
        onDrawerOpen={() => setDrawerOpen(true)}
      />
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <RouterDrawerItem />
      </Drawer>
      <div id="setting" className="flex flex-col gap-2 px-4 pt-20 pb-10">
        {userId && (
          <Slot
            icon="coupon"
            text={l10n.t("coupon")}
            behavior={() => setCouponDialogOpen(true)}
          />
        )}
        <Slot
          icon="agreement"
          text={l10n.t("userAgreement")}
          behavior={() => navigator("/setting/user-agreement")}
        />
        <Slot
          icon="privacy"
          text={l10n.t("privacyPolicy")}
          behavior={() => navigator("/setting/privacy-policy")}
        />
        {userId && (
          <Slot
            icon="signout"
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
            icon="person-slash"
            text={l10n.t("deleteAccount")}
            color="red"
            behavior={() => setDeleteAccountDialogOpen(true)}
          />
        )}
      </div>

      <Dialog open={couponDialogOpen} onOpenChange={setCouponDialogOpen}>
        <UseCoupon onClose={() => setCouponDialogOpen(false)} />
      </Dialog>

      <Dialog open={deleteAccountDialogOpen} onOpenChange={setDeleteAccountDialogOpen}>
        <DeleteAccount />
      </Dialog>
    </div>
  );
}
