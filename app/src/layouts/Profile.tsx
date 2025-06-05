import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AppBar from "../components/public/AppBar";
import Drawer from "../components/drawer/Drawer";
import ProfileAppBarItem from "../components/profile/ProfileAppBarItem";
import ProfileBar from "../components/profile/ProfileBar";
import Sidebox from "../components/home/Sidebox";
import InfiniteScroll from "../components/post/InfiniteScroll";
import TabBar from "../components/profile/TabBar";
import ProfileTabBarItem from "../components/profile/ProfileTabBarItem";
import Content from "../components/post/Content";
import RouterDrawerItem from "../components/drawer/RouterDrawerItem";
import ProfileComment from "../components/profile/ProfileComment";
import { Post, CommentProps } from "../Types";

import { createMockPost, createMockComment } from "../../dev/mockdata";

export default function Profile() {
  const [tabIdx, setState] = useState(0);
  const { userId } = useParams();

  const [postList, setPostList] = useState([] as Post[]);
  const [commentList, setCommentList] = useState([] as CommentProps[]);
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

  useEffect(() => {
    //TODO: fetch user data
    setPostList(Array.from({ length: 10 }).map(() => createMockPost()));
    setCommentList(Array.from({ length: 10 }).map(() => createMockComment()));
    setLikePostList(Array.from({ length: 10 }).map(() => createMockPost()));
    //

    window.scrollTo(0, 0);

    window.addEventListener("resize", resizeEvent);
    return () => window.removeEventListener("resize", resizeEvent);
  }, []);

  return (
    <div id="scaffold" className="w-full h-screen mx-auto content-start">
      <AppBar child={<ProfileAppBarItem />} />
      <Drawer child={<RouterDrawerItem />} />
      <div id="profile" className="flex justify-center gap-10 pt-14">
        <div>
          <ProfileBar userId={userId!} />
          <TabBar
            child={<ProfileTabBarItem idx={tabIdx} idxDispatcher={setState} />}
          />
          {(tabIdx == 0 && (
            <InfiniteScroll
              component={Content}
              item={postList}
              loadMore={() => {}}
            />
          )) ||
            (tabIdx == 1 && (
              <InfiniteScroll
                component={ProfileComment}
                item={commentList}
                loadMore={() => {}}
              />
            )) ||
            (tabIdx == 2 && (
              <InfiniteScroll
                component={Content}
                item={likePostList}
                loadMore={() => {}}
              />
            ))}
        </div>
        <div
          id="side"
          className={`relative ${checkWideView() ? "block" : "hidden"}`}
        >
          <div className="sticky top-24">
            <Sidebox title={"추천 친구"} fetchUrl="https://example.com" />
          </div>
        </div>
      </div>
    </div>
  );
}
