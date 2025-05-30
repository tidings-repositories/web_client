import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import IconButton from "../button/IconButton";
import Logo from "../public/Logo";
import MiniProfile from "../public/MiniProfile";

function ProfileAppBarItem() {
  let test = true; //TODO: replace to uid state
  const navigator = useNavigate();

  useEffect(() => {
    //TODO: 로그인 상태 아니면 redirect
  }, []);

  return (
    <div id="profile-appbar" className="w-full flex justify-between gap-4">
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
    </div>
  );
}

/*--------------*/

function drawerClickEvent() {
  const drawer = document.getElementById("drawer")!;
  if (drawer.style.display === "none" || !drawer.style.display)
    drawer.style.display = "block";
  else drawer.style.display = "none";
}

export default ProfileAppBarItem;
