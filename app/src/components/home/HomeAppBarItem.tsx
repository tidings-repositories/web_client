import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "../button/IconButton";
import Logo from "../public/Logo";
import OutlineButton from "../button/OutlineButton";
import MiniProfile from "../public/MiniProfile";
import * as l10n from "i18next";

function HomeAppBarItem() {
  const isLogin = true; //TODO: replace to uid state
  const navigator = useNavigate();

  useEffect(() => {
    const parentElement = document.getElementById(`searchbar`)!;
    const textElement = parentElement.querySelector(`#search`)!;
    const clearButtonIconElement = parentElement.querySelector("button")!;
    clearButtonIconElement.style.display = "none";

    if (window.innerWidth < 500)
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
        <form id="search" className="w-full">
          <input type="text" className="w-full" />
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
      {isLogin ? (
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
            onPressed={() => {
              /*open popup notification*/
            }}
          />
          <MiniProfile
            user_id="test1"
            img_url="https://ssl.pstatic.net/cmstatic/nng/img/img_anonymous_square_gray_opacity2x.png"
          />
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

/*--------------*/
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
  if (window.innerWidth < 500)
    document.getElementById("typography")!.style.display = "none";
  else document.getElementById("typography")!.style.display = "block";
};

export default HomeAppBarItem;
