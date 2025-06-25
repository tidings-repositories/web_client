import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "../button/IconButton";
import Logo from "../public/Logo";
import OutlineButton from "../button/OutlineButton";
import MiniProfile from "../public/MiniProfile";
import NotificationDropdownItem from "../notification/NotificationDropdownItem";
import Dropdown from "../public/Dropdown";
import Dialog from "../public/Dialog";
import Sign from "../sign/Sign";
import ReactDOM from "react-dom/client";
import * as l10n from "i18next";
import useUserDataStore from "../../store/UserDataStore";

function HomeAppBarItem() {
  const userId = useUserDataStore((state) => state.user_id);
  const profileImage = useUserDataStore((state) => state.profile_image);
  const navigator = useNavigate();

  useEffect(() => {
    const parentElement = document.getElementById(`searchbar`)!;
    const textElement = parentElement.querySelector(`#search`)!;
    const clearButtonIconElement = parentElement.querySelector("button")!;
    clearButtonIconElement.style.display = "none";

    if (window.innerWidth < 550)
      document.getElementById("typography")!.style.display = "none";

    const eventHandler = (e: Event) =>
      changeViewStateClearButtonEvent(e, clearButtonIconElement);

    window.addEventListener("resize", resizeEvent);
    textElement.addEventListener("input", eventHandler);
    return () => {
      textElement.removeEventListener("input", eventHandler);
      window.removeEventListener("resize", resizeEvent);
    };
  }, []);

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
      {/*search bar*/}
      <div
        id="searchbar"
        className="flex w-full max-w-120 px-2 my-1 gap-2 rounded-xl bg-gray-100 items-center justify-between"
      >
        <i
          className="fa-solid fa-magnifying-glass"
          style={{ fontSize: 18, color: "gray" }}
        ></i>
        <form
          id="search"
          className="w-full"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const query = (formData.get("search") as string) ?? "";
            navigator(`/search?q=${query.trim()}`);
          }}
        >
          <input type="text" name="search" className="w-full" />
        </form>
        <IconButton
          icon="fa-solid fa-xmark"
          onPressed={() => {
            const tagTextfield = document.getElementById(
              `search`
            ) as HTMLFormElement;
            tagTextfield.reset();
            tagTextfield.dispatchEvent(new Event("input", { bubbles: true }));
          }}
        />
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
          onPressed={openDialog}
        />
      )}
    </div>
  );
}

/*--------------*/
function openDialog() {
  const newDialog = document.createElement("div");
  newDialog.id = `dialog-box`;
  document.querySelector("body")!.appendChild(newDialog);
  const root = ReactDOM.createRoot(newDialog);
  root.render(<Dialog child={<Sign />} />);
}

function changeViewStateClearButtonEvent(
  event: Event,
  clearButtonIconElement: HTMLElement
) {
  const EMPTY = "";
  const TEXT = (event.target as HTMLInputElement).value;
  if (TEXT == EMPTY || !TEXT) {
    clearButtonIconElement!.style.display = "none";
  } else {
    clearButtonIconElement!.style.display = "block";
  }
}

function drawerClickEvent() {
  const drawer = document.getElementById("drawer")!;
  if (drawer.style.display === "none" || !drawer.style.display)
    drawer.style.display = "block";
  else drawer.style.display = "none";
}

const resizeEvent = () => {
  if (window.innerWidth < 550)
    document.getElementById("typography")!.style.display = "none";
  else document.getElementById("typography")!.style.display = "block";
};

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

export default HomeAppBarItem;
