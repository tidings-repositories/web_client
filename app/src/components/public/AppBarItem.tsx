import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu } from "radix-ui";
import IconButton from "../button/IconButton";
import Logo from "../public/Logo";
import OutlineButton from "../button/OutlineButton";
import MiniProfile from "../public/MiniProfile";
import NotificationDropdownItem from "../notification/NotificationDropdownItem";
import Dialog from "../public/Dialog";
import Sign from "../sign/Sign";
import * as l10n from "i18next";
import useUserDataStore from "../../store/UserDataStore";
import iconPack from "./IconPack";

function AppBarItem({
  showDrawer,
  showLogo,
  showSearch,
  showMessage,
  showCompmoser,
  showNoti,
  showProfile,
  showLogin,
  searchKeyword,
  onDrawerOpen,
}) {
  const userId = useUserDataStore((state) => state.user_id);
  const profileImage = useUserDataStore((state) => state.profile_image);
  const navigator = useNavigate();

  const [signDialogOpen, setSignDialogOpen] = useState(false);

  useEffect(() => {
    if (showSearch) {
      const parentElement = document.getElementById(`searchbar`)!;
      const textElement = parentElement.querySelector(`#search-input`)!;
      const clearButtonIconElement = parentElement.querySelector("button")!;
      clearButtonIconElement.style.display =
        searchKeyword == "" ? "none" : "block";

      if (window.innerWidth < 550)
        document.getElementById("typography")!.style.display = "none";

      textElement.querySelector("input")!.value = searchKeyword;

      const eventHandler = (e: Event) =>
        changeViewStateClearButtonEvent(e, clearButtonIconElement);

      textElement.addEventListener("input", eventHandler);
      window.addEventListener("resize", resizeEvent);

      return () => {
        textElement.removeEventListener("input", eventHandler);
        window.removeEventListener("resize", resizeEvent);
      };
    }
  }, []);

  return (
    <div id="appbar-items" className="w-full flex justify-between gap-4">
      {/*Drawer button and Logo button*/}
      <div className="flex shrink-0 gap-1">
        {showDrawer && (
          <IconButton icon="menu" size={24} onPressed={() => onDrawerOpen?.()} />
        )}
        {showLogo && <Logo />}
      </div>
      {/*search bar*/}
      {showSearch && (
        <div
          id="searchbar"
          className="flex w-full max-w-120 px-2 my-1 gap-2 rounded-xl bg-gray-100 items-center justify-between"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{
              color: "gray",
              width: 24,
              height: 24,
            }}
          >
            {iconPack("search")}
          </svg>
          <form
            id="search-input"
            className="w-full"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const query = (formData.get("search-input") as string) ?? "";
              navigator(`/search?q=${query.trim()}`);
            }}
          >
            <input type="text" name="search-input" className="w-full" />
          </form>
          <IconButton
            icon="xmark"
            onPressed={() => {
              const tagTextfield = document.getElementById(
                `search`
              ) as HTMLFormElement;
              tagTextfield.reset();
              tagTextfield.dispatchEvent(new Event("input", { bubbles: true }));
            }}
          />
        </div>
      )}
      {/*login feature or user feature*/}
      {userId ? (
        <div className="content-center items-center flex gap-2">
          {showMessage && (
            <IconButton
              icon="message"
              size={24}
              onPressed={() => navigator("/message")}
            />
          )}
          {showCompmoser && (
            <IconButton
              icon="compose"
              size={24}
              onPressed={() => navigator("/compose/post")}
            />
          )}
          {showNoti && (
            <DropdownMenu.Root modal={false}>
              <DropdownMenu.Trigger asChild>
                <IconButton icon="bell" size={24} onPressed={() => {}} />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  className="py-1 bg-gray-200 z-[51] rounded-lg"
                >
                  <NotificationDropdownItem user_id={userId} />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          )}
          {showProfile && (
            <MiniProfile user_id={userId} img_url={profileImage ?? ""} />
          )}
        </div>
      ) : (
        showLogin && (
          <OutlineButton
            fontSize="sm"
            color="gray"
            text={`${l10n.t("signIn")}`}
            radius={12}
            onPressed={() => setSignDialogOpen(true)}
          />
        )
      )}

      {/*Sign In Dialog*/}
      <Dialog open={signDialogOpen} onOpenChange={setSignDialogOpen}>
        <Sign />
      </Dialog>
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

const resizeEvent = () => {
  if (window.innerWidth < 550)
    document.getElementById("typography")!.style.display = "none";
  else document.getElementById("typography")!.style.display = "block";
};

export default AppBarItem;
