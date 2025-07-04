import { useCallback, useEffect, useRef, useState } from "react";
import InfiniteScroll from "../components/post/InfiniteScroll";
import Sidebox from "../components/home/Sidebox";
import AppBar from "../components/public/AppBar";
import HomeAppBarItem from "../components/home/HomeAppBarItem";
import Drawer from "../components/drawer/Drawer";
import QuickPostComposer from "../components/composer/QuickPostComposer";
import Content from "../components/post/Content";
import RouterDrawerItem from "../components/drawer/RouterDrawerItem";
import * as l10n from "i18next";
import { produce } from "immer";
import useUserDataStore from "../store/UserDataStore";
import axios from "axios";
import { Post } from "../Types";
import dayjs from "dayjs";

export default function Home() {
  const userId = useUserDataStore((state) => state.user_id);
  const wideViewStandard = 1000;
  const postRef = useRef<Post[]>([]);
  const [postList, setPostList] = useState<Post[]>([]);
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

  const handleScrollFetch = useCallback(async () => {
    const lastPost: Post = postRef.current[postRef.current.length - 1];
    const OK = 200;
    const response = await axios
      .post(`${import.meta.env.VITE_API_URL}/post/recent`, {
        postId: lastPost.post_id,
        createdAt: dayjs(lastPost.create_at).tz("Asia/Seoul").format(),
      })
      .catch((_) => _);
    if (response.status == OK && response.data.length != 0) {
      setPostList(
        produce((draft) => {
          draft.push(...response.data);
        })
      );
      return true;
    } else {
      return false;
    }
  }, []);

  useEffect(() => {
    const getRecentPosts = async () => {
      const OK = 200;
      const response = await axios
        .post(`${import.meta.env.VITE_API_URL}/post/recent`, {})
        .catch((_) => _);
      if (response.status == OK) setPostList(response.data);
    };

    getRecentPosts();

    window.addEventListener("resize", resizeEvent);
    return () => window.removeEventListener("resize", resizeEvent);
  }, []);

  useEffect(() => {
    postRef.current = postList;
  }, [postList]);

  return (
    <div id="scaffold" className="w-full h-screen mx-auto content-start">
      <AppBar child={<HomeAppBarItem />} />
      <Drawer child={<RouterDrawerItem />} />
      <div id="home" className="flex justify-center gap-10 pt-16">
        <div>
          {userId && <QuickPostComposer />}
          <InfiniteScroll
            component={Content}
            item={postList}
            loadMore={handleScrollFetch}
          />
        </div>
        <div
          id="side"
          className={`relative ${checkWideView() ? "block" : "hidden"}`}
        >
          <div className="sticky top-24">
            <Sidebox
              title={l10n.t("dailyPopular")}
              fetchUrl="https://example.com"
            />
            <Sidebox
              title={l10n.t("weeklyPopular")}
              fetchUrl="https://example.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
