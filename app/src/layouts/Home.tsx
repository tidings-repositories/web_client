import { useCallback, useEffect, useRef, useState } from "react";
import InfiniteScroll from "../components/post/InfiniteScroll";
import Sidebox from "../components/public/Sidebox";
import AppBar from "../components/public/AppBar";
import Drawer from "../components/drawer/Drawer";
import QuickPostComposer from "../components/composer/QuickPostComposer";
import Content from "../components/post/Content";
import RouterDrawerItem from "../components/drawer/RouterDrawerItem";
import { produce } from "immer";
import useUserDataStore from "../store/UserDataStore";
import axios from "axios";
import { Post } from "../Types";
import dayjs from "dayjs";
import PostContext from "../context/PostContext";
import TabBar from "../components/public/TabBar";
import HomeTabBarItem from "../components/home/HomeTabBarItem";
import { requestPOSTWithToken } from "../scripts/requestWithToken";
import { useNavigationType, useBlocker } from "react-router-dom";

export default function Home() {
  const userId = useUserDataStore((state) => state.user_id);
  const [scrolled, setScrollState] = useState(false);
  const [tabIdx, setIdxState] = useState(0);

  const postRef = useRef<Post[]>([]);
  const [postList, setPostList] = useState<Post[]>([]);

  const feedRef = useRef<Post[]>([]);
  const [feedList, setFeedList] = useState<Post[]>([]);

  const wideViewStandard = 1000;
  const checkWideView = () => window.innerWidth > wideViewStandard;

  const deletePost = (postId: string) => {
    setPostList((prev) => prev.filter((post) => post.post_id !== postId));
  };

  // const resizeEvent = () => {
  //   const sideElement = document.getElementById("side")!;
  //   const isSideExist = sideElement.style.display === "block";

  //   if (isSideExist && !checkWideView()) {
  //     sideElement.style.display = "none";
  //   } else if (!isSideExist && checkWideView()) {
  //     sideElement.style.display = "block";
  //   }
  // };

  const scrollEvent = () => {
    const STANDARD = 1000;
    setScrollState((state) => {
      if (!state && window.scrollY > STANDARD) return true;
      else if (state && window.scrollY <= STANDARD) return false;
      else return state;
    });
  };

  const handleScrollRecentFetch = useCallback(async () => {
    const lastPost: Post = postRef.current[postRef.current.length - 1];
    if (!lastPost) return true;

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

  const handleScrollFeedFetch = useCallback(async () => {
    const lastPost: Post = feedRef.current[feedRef.current.length - 1];
    if (!lastPost) return true;

    const OK = 200;
    const response = await requestPOSTWithToken(
      `${import.meta.env.VITE_API_URL}/post/feed`,
      {
        postId: lastPost.post_id,
        createdAt: dayjs(lastPost.create_at).tz("Asia/Seoul").format(),
      }
    ).catch((_) => _);

    if (response.status == OK && response.data.length != 0) {
      setFeedList(
        produce((draft) => {
          draft.push(...response.data);
        })
      );
      return true;
    } else {
      return false;
    }
  }, []);

  const blocker = useBlocker(true);
  useEffect(() => {
    if (blocker.proceed) {
      if (blocker.location.pathname == location.pathname) {
        return blocker.proceed();
      }

      const KEY = "pageStateHistory";
      const pageStateHistory = sessionStorage.getItem(KEY) ?? "[]";
      const stack = JSON.parse(pageStateHistory);

      stack.push({
        path: location.pathname,
        tab: tabIdx,
        data: tabIdx == 0 ? postList : feedList,
        scroll: scrollY,
      });
      sessionStorage.setItem(KEY, JSON.stringify(stack));

      blocker.proceed();
    }
  }, [blocker]);

  const navigationType = useNavigationType();
  useEffect(() => {
    const KEY = "pageStateHistory";
    const pageStateHistory = sessionStorage.getItem(KEY) ?? "[]";
    const stack = JSON.parse(pageStateHistory);
    const lastHistory = stack.pop();

    if (
      navigationType == "POP" &&
      lastHistory &&
      lastHistory.path == location.pathname
    ) {
      sessionStorage.setItem(KEY, JSON.stringify(stack));
      lastHistory.tab == 0
        ? setPostList(lastHistory.data)
        : setFeedList(lastHistory.data);
      setIdxState(lastHistory.tab);

      requestAnimationFrame(() =>
        setTimeout(() => {
          window.scrollTo(0, lastHistory.scroll);
        })
      );
    } else {
      if (lastHistory) stack.push(lastHistory);
      sessionStorage.setItem(KEY, JSON.stringify(stack));

      window.scrollTo(0, 0);

      const OK = 200;
      const getRecentPosts = async () => {
        const response = await axios
          .post(`${import.meta.env.VITE_API_URL}/post/recent`, {})
          .catch((_) => _);
        if (response.status == OK) setPostList(response.data);
      };

      const getFeedPosts = async () => {
        const response = await requestPOSTWithToken(
          `${import.meta.env.VITE_API_URL}/post/feed`,
          {}
        ).catch((_) => _);
        if (response.status == OK) setFeedList(response.data);
      };

      setPostList((prev) => {
        if (tabIdx == 0 && prev.length == 0) getRecentPosts();
        return prev;
      });
      setFeedList((prev) => {
        if (tabIdx == 1 && prev.length == 0) getFeedPosts();
        return prev;
      });
    }
  }, [tabIdx]);

  useEffect(() => {
    // window.addEventListener("resize", resizeEvent);
    window.addEventListener("scroll", scrollEvent);
    return () => {
      // window.removeEventListener("resize", resizeEvent);
      window.removeEventListener("scroll", scrollEvent);
    };
  }, []);

  useEffect(() => {
    postRef.current = postList;
  }, [postList]);

  useEffect(() => {
    feedRef.current = feedList;
  }, [feedList]);

  return (
    <div id="scaffold" className="w-full h-screen mx-auto content-start">
      <AppBar />
      <Drawer child={<RouterDrawerItem />} />
      <div id="home" className="flex justify-center gap-10 pt-16">
        <div className="flex flex-col">
          <div id="dummy-area" className="w-[98vw] max-w-173"></div>
          {userId && <QuickPostComposer />}
          {userId && (
            <TabBar
              child={
                <HomeTabBarItem idx={tabIdx} idxDispatcher={setIdxState} />
              }
            />
          )}
          {tabIdx == 0 && (
            <PostContext.Provider value={{ deletePost }}>
              <InfiniteScroll
                component={Content}
                item={postList}
                loadMore={handleScrollRecentFetch}
              />
            </PostContext.Provider>
          )}
          {tabIdx == 1 && (
            <InfiniteScroll
              component={Content}
              item={feedList}
              loadMore={handleScrollFeedFetch}
            />
          )}
        </div>
        {/* <div
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
        </div> */}
      </div>
      {scrolled && (
        <div
          role="button"
          id="floating-action-button"
          className="sticky left-10 bottom-10 w-15 h-15 bg-white rounded-4xl content-center text-center cursor-pointer shadow shadow-md shadow-gray-500"
          onClick={() => window.scrollTo(0, 0)}
        >
          <i
            className="fa-solid fa-angle-up"
            style={{ color: "gray", fontSize: 24 }}
          />
        </div>
      )}
    </div>
  );
}
