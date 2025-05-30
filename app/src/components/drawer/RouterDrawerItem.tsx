import Slot from "./Slot";
import { useNavigate } from "react-router-dom";

function RouterDrawerItem() {
  const myUserId = "test1"; //TODO: change to user id state
  const navigator = useNavigate();

  return (
    <div className="flex flex-col gap-2">
      <Slot
        icon="fa-solid fa-house-chimney-window"
        text="Home"
        behavior={() => navigator("/")}
      />
      <Slot
        icon="fa-solid fa-magnifying-glass"
        text="Search"
        behavior={() => navigator("/search")}
      />
      <Slot
        icon="fa-solid fa-user"
        text="Profile"
        behavior={() => navigator(`/profile/${myUserId}`)}
      />
      <Slot
        icon="fa-solid fa-message"
        text="Direct Message"
        behavior={() => navigator("/message")}
      />
      <Slot
        icon="fa-solid fa-gear"
        text="Settings"
        behavior={() => navigator("/setting")}
      />
    </div>
  );
}

export default RouterDrawerItem;
