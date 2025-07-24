import { useBlocker, useNavigationType, useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import AppBar from "../components/public/AppBar";
import Drawer from "../components/drawer/Drawer";
import ProfileBar from "../components/profile/ProfileBar";
import Sidebox from "../components/public/Sidebox";
import InfiniteScroll from "../components/post/InfiniteScroll";
import TabBar from "../components/public/TabBar";
import ProfileTabBarItem from "../components/profile/ProfileTabBarItem";
import Content from "../components/post/Content";
import RouterDrawerItem from "../components/drawer/RouterDrawerItem";
import ProfileComment from "../components/profile/ProfileComment";
import { Post, CommentProps } from "../Types";
import axios from "axios";
import { produce } from "immer";
import dayjs from "dayjs";
import PostContext from "../context/PostContext";
import useUserDataStore from "../store/UserDataStore";
import useLikePostStore from "../store/LikePostStore";

export default function Profile() {
  const myUserId = useUserDataStore((state) => state.user_id);
  const likePostInjection = useLikePostStore((state) => state.dataInjection);

  const [tabIdx, setState] = useState(0);
  const { userId } = useParams();

  const postRef = useRef<Post[]>([]);
  const [postList, setPostList] = useState([] as Post[]);

  const commentRef = useRef<CommentProps[]>([]);
  const [commentList, setCommentList] = useState([] as CommentProps[]);

  const likePostRef = useRef<Post[]>([]);
  const [likePostList, setLikePostList] = useState([] as Post[]);

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

  const deletePost = (postId: string) => {
    setPostList((prev) => prev.filter((post) => post.post_id !== postId));
  };

  const POST = 0,
    COMMENT = 1,
    LIKE = 2;
  const OK = 200;

  const getUserPostList = async () => {
    const defaultCreatedAt = dayjs().tz("Asia/Seoul").format();
    const response = await axios
      .post(`${import.meta.env.VITE_API_URL}/profile/${userId}/posts`, {
        createdAt: defaultCreatedAt,
      })
      .catch((_) => _);
    if (response.status == OK) setPostList(response.data);
  };

  const getUserCommentList = async () => {
    const defaultCreatedAt = dayjs().tz("Asia/Seoul").format();
    const response = await axios
      .post(`${import.meta.env.VITE_API_URL}/profile/${userId}/comments`, {
        createdAt: defaultCreatedAt,
      })
      .catch((_) => _);
    if (response.status == OK) setCommentList(response.data);
  };

  const getUserLikePostList = async () => {
    const defaultCreatedAt = dayjs().tz("Asia/Seoul").format();
    const response = await axios
      .post(`${import.meta.env.VITE_API_URL}/profile/${userId}/likes`, {
        createdAt: defaultCreatedAt,
      })
      .catch((_) => _);
    if (response.status == OK) setLikePostList(response.data);
  };

  const handlePostScrollFetch = useCallback(async () => {
    const lastPost: Post = postRef.current[postRef.current.length - 1];
    if (!lastPost) return true;
    const OK = 200;
    const response = await axios
      .post(`${import.meta.env.VITE_API_URL}/profile/${userId}/posts`, {
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

  const handleCommentScrollFetch = useCallback(async () => {
    const lastComment: CommentProps =
      commentRef.current[commentRef.current.length - 1];
    if (!lastComment) return true;

    const OK = 200;
    const response = await axios
      .post(`${import.meta.env.VITE_API_URL}/profile/${userId}/comments`, {
        createdAt: dayjs(lastComment.create_at).tz("Asia/Seoul").format(),
      })
      .catch((_) => _);
    if (response.status == OK && response.data.length != 0) {
      setCommentList(
        produce((draft) => {
          draft.push(...response.data);
        })
      );
      return true;
    } else {
      return false;
    }
  }, []);

  const handleLikePostScrollFetch = useCallback(async () => {
    const lastPost: Post = likePostRef.current[likePostRef.current.length - 1];
    if (!lastPost) return true;

    const OK = 200;
    const lastPostCreatedAt = dayjs(lastPost.like_at ?? lastPost.create_at)
      .tz("Asia/Seoul")
      .format();
    const response = await axios
      .post(`${import.meta.env.VITE_API_URL}/profile/${userId}/likes`, {
        createdAt: lastPostCreatedAt,
        postId: lastPost.post_id,
      })
      .catch((_) => _);
    if (response.status == OK && response.data.length != 0) {
      setLikePostList(
        produce((draft) => {
          draft.push(...response.data);
        })
      );
      if (userId == myUserId) likePostInjection(response.data);

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
        data:
          tabIdx == POST
            ? postList
            : tabIdx == COMMENT
            ? commentList
            : likePostList,
        scroll: scrollY,
      });
      sessionStorage.setItem(KEY, JSON.stringify(stack));
      blocker.proceed();
    }
  }, [blocker]);

  useEffect(() => {
    setPostList([]);
    setCommentList([]);
    setLikePostList([]);
  }, [userId]);

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

      if (lastHistory.tab == POST) setPostList(lastHistory.data);
      else if (lastHistory.tab == COMMENT) setCommentList(lastHistory.data);
      else if (lastHistory.tab == LIKE) setLikePostList(lastHistory.data);

      setState(lastHistory.tab);
      setTimeout(() =>
        requestAnimationFrame(() => {
          window.scrollTo(0, lastHistory.scroll);
        })
      );
    } else {
      if (lastHistory) stack.push(lastHistory);
      sessionStorage.setItem(KEY, JSON.stringify(stack));

      setPostList((prev) => {
        if (tabIdx == POST && prev.length == 0) {
          getUserPostList();
          window.scrollTo(0, 0);
        }
        return prev;
      });
      setCommentList((prev) => {
        if (tabIdx == COMMENT && prev.length == 0) {
          getUserCommentList();
          window.scrollTo(0, 0);
        }

        return prev;
      });
      setLikePostList((prev) => {
        if (tabIdx == LIKE && prev.length == 0) {
          getUserLikePostList();
          window.scrollTo(0, 0);
        }
        return prev;
      });
    }
  }, [tabIdx, userId]);

  useEffect(() => {
    postRef.current = postList;
  }, [postList]);

  useEffect(() => {
    commentRef.current = commentList;
  }, [commentList]);

  useEffect(() => {
    likePostRef.current = likePostList;
  }, [likePostList]);

  useEffect(() => {
    window.addEventListener("resize", resizeEvent);
    return () => window.removeEventListener("resize", resizeEvent);
  }, []);

  return (
    <div id="scaffold" className="w-full h-screen mx-auto content-start">
      <AppBar showSearch={false} />
      <Drawer child={<RouterDrawerItem />} />
      <div id="profile" className="flex justify-center gap-10 pt-14">
        <div className="sticky left-0 ">
          <ProfileBar profileUser={userId!} />
          <TabBar
            child={<ProfileTabBarItem idx={tabIdx} idxDispatcher={setState} />}
          />
          {(tabIdx == 0 && (
            <PostContext.Provider value={{ deletePost }}>
              <InfiniteScroll
                component={Content}
                item={postList}
                loadMore={handlePostScrollFetch}
              />
            </PostContext.Provider>
          )) ||
            (tabIdx == 1 && (
              <InfiniteScroll
                component={ProfileComment}
                item={commentList}
                loadMore={handleCommentScrollFetch}
              />
            )) ||
            (tabIdx == 2 && (
              <InfiniteScroll
                component={Content}
                item={likePostList}
                loadMore={handleLikePostScrollFetch}
              />
            ))}
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
