import { useEffect } from "react";
import useUserDataStore from "../../store/UserDataStore";
import useFollowingUserStore from "../../store/FollowingUserStore";
import { requestGETWithToken } from "../../scripts/requestWithToken";
import axios, { AxiosResponse } from "axios";
import useLikePostStore from "../../store/LikePostStore";
import dayjs from "dayjs";
import AppBarItem from "./AppBarItem";

function AppBar({
  showDrawer = true,
  showLogo = true,
  showSearch = true,
  showMessage = false,
  showCompmoser = true,
  showNoti = false,
  showProfile = true,
  showLogin = true,
  searchKeyword = "",
}) {
  const userId = useUserDataStore((state) => state.user_id);
  const userDataInjection = useUserDataStore((state) => state.dataInjection);

  const followingTable = useFollowingUserStore(
    (state) => state.followingIdTable
  );
  const followingDataInjection = useFollowingUserStore(
    (state) => state.dataInjection
  );

  const likePostTable = useLikePostStore((state) => state.likePostTable);
  const likePostDataInjection = useLikePostStore(
    (state) => state.dataInjection
  );

  const MY_USERDATA_REQUEST_URL = `${import.meta.env.VITE_API_URL}/profile`;
  const MY_FOLLOWING_REQUEST_URL = `${
    import.meta.env.VITE_API_URL
  }/profile/${userId}/followings`;
  const MY_LIKEPOST_REQUEST_URL = `${
    import.meta.env.VITE_API_URL
  }/profile/${userId}/likes`;

  useEffect(() => {
    const fetchMyUserData = async () => {
      const OK = 200;
      const response = await requestGETWithToken(MY_USERDATA_REQUEST_URL);
      if (response.status == OK)
        userDataInjection((response as AxiosResponse).data);
    };

    if (userId == null) fetchMyUserData();
  }, []);

  useEffect(() => {
    const OK = 200;
    const fetchMyFollowingUsers = async () => {
      const response = await axios.get(MY_FOLLOWING_REQUEST_URL).catch((_) => {
        useFollowingUserStore((state) => state.clear)();
        return _;
      });

      if (response && response.status == OK)
        followingDataInjection(response.data);
    };

    const fetchMyLikePosts = async () => {
      const defaultCreatedAt = dayjs().tz("Asia/Seoul").format();
      const response = await axios
        .post(MY_LIKEPOST_REQUEST_URL, {
          createdAt: defaultCreatedAt,
        })
        .catch((_) => {
          useLikePostStore((state) => state.clear)();
          return _;
        });

      if (response && response.status == OK)
        likePostDataInjection(response.data);
    };

    if (userId != null && followingTable == null) fetchMyFollowingUsers();
    if (userId != null && likePostTable == null) fetchMyLikePosts();
  }, [userId]);

  return (
    <div
      id="appbar"
      className="fixed top-0 left-0 w-full h-14 px-4 bg-white border-solid border-b-2 border-gray-100 z-50 content-center"
    >
      <AppBarItem
        showDrawer={showDrawer}
        showLogo={showLogo}
        showSearch={showSearch}
        showMessage={showMessage}
        showCompmoser={showCompmoser}
        showNoti={showNoti}
        showProfile={showProfile}
        showLogin={showLogin}
        searchKeyword={searchKeyword}
      />
    </div>
  );
}

export default AppBar;
