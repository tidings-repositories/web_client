import { useNavigate } from "react-router-dom";
import IconButton from "../button/IconButton";
import Logo from "../public/Logo";
import OutlineButton from "../button/OutlineButton";
import MiniProfile from "../public/MiniProfile";
import NotificationDropdownItem from "../notification/NotificationDropdownItem";
import Dropdown from "../public/Dropdown";
import ReactDOM from "react-dom/client";
import * as l10n from "i18next";
import useUserDataStore from "../../store/UserDataStore";

function PostAppBarItem() {
  const userId = useUserDataStore((state) => state.user_id);
  const profileImage = useUserDataStore((state) => state.profile_image);
  const navigator = useNavigate();

  return (
    <div id="home-appbar" className="w-full flex justify-between gap-4">
      {/*Drawer button and Logo button*/}
      <div className="flex shrink-0 gap-1">
        <IconButton
          icon="fa-solid fa-bars"
          size={18}
          onPressed={drawerClickEvent}
        />
        <Logo />
      </div>
      {/*login feature or user feature*/}
      {userId ? (
        <div className="content-center items-center flex gap-2">
          <IconButton
            icon="fa-solid fa-message"
            size={18}
            onPressed={() => navigator("/message")}
          />
          <IconButton
            icon="fa-solid fa-pen-to-square"
            size={18}
            onPressed={() => navigator("/compose/post")}
          />
          <IconButton
            icon="fa-solid fa-bell"
            size={18}
            onPressed={(e) =>
              openNotificationDropdown(e, "notification-dropdown", userId)
            }
          />
          <MiniProfile user_id={userId} img_url={profileImage ?? ""} />
        </div>
      ) : (
        <OutlineButton
          fontSize="sm"
          color="gray" //TODO: 컬러 테마 설정
          text={`${l10n.t("signIn")}`}
          radius={12}
          onPressed={() => {}}
        />
      )}
    </div>
  );
}

/*------------*/

function drawerClickEvent() {
  const drawer = document.getElementById("drawer")!;
  if (drawer.style.display === "none" || !drawer.style.display)
    drawer.style.display = "block";
  else drawer.style.display = "none";
}

function openNotificationDropdown(e, dropdownId, userId) {
  const rect = e.currentTarget.getBoundingClientRect();
  const pos = {
    x: rect.right,
    y: -window.scrollY,
  };

  const newDropdown = document.createElement("div");
  newDropdown.id = `${dropdownId}-box`;
  newDropdown.style.zIndex = "51";
  newDropdown.style.top = `${rect.bottom}px`;
  newDropdown.style.position = "fixed";
  document.querySelector("body")!.appendChild(newDropdown);
  const root = ReactDOM.createRoot(newDropdown);
  root.render(
    <Dropdown
      id={dropdownId}
      position={pos}
      child={<NotificationDropdownItem user_id={userId} />}
    />
  );
}

export default PostAppBarItem;
