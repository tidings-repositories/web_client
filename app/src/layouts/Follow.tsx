import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserData } from "../Types";
import AppBar from "../components/public/AppBar";
import Drawer from "../components/drawer/Drawer";
import RouterDrawerItem from "../components/drawer/RouterDrawerItem";
import TabBar from "../components/profile/TabBar";
import FollowTabBarItem from "../components/profile/FollowTabBarItem";
import Sidebox from "../components/public/Sidebox";
import IconButton from "../components/button/IconButton";
import SimpleUserSlot from "../components/public/SimpleUserSlot";
import UserSlot from "../components/public/UserSlot";

import axios from "axios";

export default function Follow() {
  const navigator = useNavigate();
  const location = useLocation();
  const tabName = location.pathname.split("/").pop();
  const [userInfo, setUserInfo] = useState(location.state as UserData);
  const [tabIdx, setState] = useState(tabName == "following" ? 0 : 1);

  const [userFollowing, setUserFollowing] = useState([] as UserData[]);
  const [userFollowers, setUserFollowers] = useState([] as UserData[]);

  const wideViewStandard = 1000;
  const checkWideView = () => window.innerWidth > wideViewStandard;

  const resizeEvent = () => {
    const sideElement = document.getElementById("side")!;
    const isSideExist = sideElement.style.display === "block";

    if (isSideExist && !checkWideView()) {
      sideElement.style.display = "none";
    } else if (!isSideExist && checkWideView()) {
      sideElement.style.display = "block";
    }
  };

  useEffect(() => {
    const path = location.pathname.split("/");
    const profileUser = path[path.length - 2];
    const PROFILE_PATH = `${
      import.meta.env.VITE_API_URL
    }/profile/${profileUser}`;

    const fetchProfileData = async () => {
      const OK = 200;
      const result = await axios.get(PROFILE_PATH);
      if (result.status == OK) setUserInfo(result.data);
    };
    if (!userInfo) fetchProfileData();

    const fetchFollowingList = async () => {
      const OK = 200;
      const result = await axios.get(`${PROFILE_PATH}/followings`);
      if (result.status == OK) setUserFollowing(result.data);
    };
    const fetchFollowerList = async () => {
      const OK = 200;
      const result = await axios.get(`${PROFILE_PATH}/followers`);
      if (result.status == OK) setUserFollowers(result.data);
    };
    fetchFollowingList();
    fetchFollowerList();

    window.scrollTo(0, 0);

    window.addEventListener("resize", resizeEvent);
    return () => window.removeEventListener("resize", resizeEvent);
  }, []);

  return (
    <div id="scaffold" className="w-full h-screen mx-auto content-start">
      <AppBar showSearch={false} />
      <Drawer child={<RouterDrawerItem />} />
      <div id="follow" className="flex justify-center gap-10 pt-14">
        <div className="sticky flex flex-col left-0" style={{ top: 1 }}>
          {/*sticky top size is appbar size*/}
          <div className="sticky top-14 bg-white">
            <div className="flex gap-2 p-2">
              <IconButton
                icon="fa-solid fa-chevron-left"
                onPressed={() => navigator(`/profile/${userInfo.user_id}`)}
              />
              <SimpleUserSlot {...userInfo} />
            </div>
            <TabBar
              child={<FollowTabBarItem idx={tabIdx} idxDispatcher={setState} />}
            />
          </div>
          {/*followers & following*/}
          <div className="flex flex-col">
            {(tabIdx == 0 &&
              userFollowing.map((user, idx) => (
                <UserSlot key={idx} {...user} />
              ))) ||
              (tabIdx == 1 &&
                userFollowers.map((user, idx) => (
                  <UserSlot key={idx} {...user} />
                )))}
          </div>
        </div>

        {/* <div
          id="side"
          className={`relative ${checkWideView() ? "block" : "hidden"}`}
        >
          <div className="sticky top-24">
            <Sidebox title={"추천 친구"} fetchUrl="https://example.com" />
          </div>
        </div> */}
      </div>
    </div>
  );
}
