import Slot from "./Slot";
import { useNavigate } from "react-router-dom";
import * as l10n from "i18next";

function RouterDrawerItem() {
  const myUserId = "test1"; //TODO: change to user id state
  const navigator = useNavigate();

  return (
    <div className="flex flex-col gap-2">
      <Slot
        icon="fa-solid fa-house-chimney-window"
        text={l10n.t("home")}
        behavior={() => navigator("/")}
      />
      <Slot
        icon="fa-solid fa-magnifying-glass"
        text={l10n.t("search")}
        behavior={() => navigator("/search")}
      />
      {myUserId && (
        <Slot
          icon="fa-solid fa-user"
          text={l10n.t("profile")}
          behavior={() => navigator(`/profile/${myUserId}`)}
        />
      )}
      {myUserId && (
        <Slot
          icon="fa-solid fa-message"
          text={l10n.t("message")}
          behavior={() => navigator("/message")}
        />
      )}
      {myUserId && (
        <Slot
          icon="fa-solid fa-gear"
          text={l10n.t("setting")}
          behavior={() => navigator("/setting")}
        />
      )}
    </div>
  );
}

export default RouterDrawerItem;
