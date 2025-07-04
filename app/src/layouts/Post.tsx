import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { PostInfo, CommentProps, UserData } from "../Types";
import MediaContent from "../components/post/MediaContent";
import PostInfoBar from "../components/post/PostInfoBar";
import PostBottomBar from "../components/post/PostBottomBar";
import MiniProfile from "../components/public/MiniProfile";
import Tag from "../components/post/Tag";
import AppBar from "../components/public/AppBar";
import PostAppBarItem from "../components/post/PostAppBarItem";
import Drawer from "../components/drawer/Drawer";
import RouterDrawerItem from "../components/drawer/RouterDrawerItem";
import Comment from "../components/post/Comment";
import OutlineButton from "../components/button/OutlineButton";

import { createMockComment } from "../../dev/mockdata";
import useUserDataStore from "../store/UserDataStore";
import axios from "axios";

export default function Post() {
  const COMMENT_TEXTFIELD_ID = "comment-textfield";
  const COMMENT_TEXT_MAXLENGTH = 100;

  const userId = useUserDataStore((state) => state.user_id);
  const userName = useUserDataStore((state) => state.user_name);
  const profileImage = useUserDataStore((state) => state.profile_image);
  const badge = useUserDataStore((state) => state.badge);

  const { postId } = useParams();
  const location = useLocation();
  const [post, setState] = useState(location.state ?? {});
  const [commentList, setComments] = useState([] as CommentProps[]);

  useEffect(() => {
    const getPostData = async () => {
      const OK = 200;
      const NOT_FOUND = 404;
      const response = await axios
        .get(`${import.meta.env.VITE_API_URL}/post/${postId}`)
        .catch((_) => _);

      if (response.status == OK) setState(response.data);
      else if (response.status == NOT_FOUND) window.location.href = "/";
    };
    if (!location.state) getPostData();
    window.scrollTo(0, 0);

    //TODO: fetch postId comments createMockComment()
    setComments(
      Array.from({ length: Math.floor(5 * Math.random()) }).map(() =>
        createMockComment()
      ) as CommentProps[]
    );
  }, []);

  return (
    <div id="scaffold" className="w-full h-screen mx-auto content-start">
      <AppBar child={<PostAppBarItem />} />
      <Drawer child={<RouterDrawerItem />} />
      <div className="w-full flex flex-col justify-center gap-2 pt-20 pb-10 divide-y-2 divide-solid divide-gray-300">
        {/*Post Content*/}
        {post.post_id ? (
          <div
            id={postId}
            className="w-full max-w-200 flex justify-start items-start gap-2 rounded-xs py-3 px-8 mx-auto"
          >
            <MiniProfile user_id={post.user_id} img_url={post.profile_image} />
            <div className="w-full flex flex-col justify-start gap-2">
              <PostInfoBar {...(post as PostInfo)} />
              <p
                className="line-clamp-6 select-text cursor-text"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {post.content.text}
              </p>
              {post.content.media.length >= 1 && (
                <MediaContent
                  contents={post.content.media}
                  post_id={post.post_id}
                />
              )}
              <div className="w-full flex flex-wrap gap-2 item-start">
                {post.content.tag.map((text, idx) => (
                  <div
                    key={`${post.post_id}${text}${idx}`}
                    className="relative"
                  >
                    <Tag content={text} />
                  </div>
                ))}
              </div>
              <PostBottomBar
                post_id={postId!}
                comment_count={post.comment_count}
                like_count={post.like_count}
                scrap_count={post.scrap_count}
              />
            </div>
          </div>
        ) : (
          <div></div>
        )}
        {/*Post Input Comment Area*/}
        {userId && (
          <div
            id="comment-input"
            className="flex gap-2 w-full max-w-200 h-40 py-3 px-8 mx-auto border-2 border-gray-400 rounded-xl items-start"
          >
            {/*미니 프로필*/}
            <div className="min-w-12 items-center">
              <MiniProfile user_id={userId} img_url={profileImage ?? ""} />
            </div>
            {/*flex flex-col 코멘트 textarea, 코멘트 버튼*/}
            <div className="flex flex-col w-full h-full">
              <div className="w-full h-full">
                <textarea
                  id={COMMENT_TEXTFIELD_ID}
                  name="comment-text"
                  wrap="hard"
                  maxLength={COMMENT_TEXT_MAXLENGTH}
                  rows={3}
                  style={{ overflow: "auto" }}
                  className="w-full h-full text-base py-1"
                  onChange={(e) => checkTextfieldMaxLine(e.target, 10)}
                ></textarea>
              </div>
              <div className="self-end items-center">
                <OutlineButton
                  text={"comment"}
                  color="gray"
                  fontSize="base"
                  backgroundColor="gray"
                  fontColor="white"
                  radius={16}
                  onPressed={() => {
                    const textarea = document.getElementById(
                      COMMENT_TEXTFIELD_ID
                    ) as HTMLTextAreaElement;
                    const commentData = textarea.value.trim();
                    textarea.value = "";

                    //TODO fetch (comment + userState + posdId) @@@@@

                    //낙관적 업데이트
                    setComments((state) => {
                      const tempCommentId = 214252112123 * Math.random();
                      const newComment = {
                        comment_id: tempCommentId.toString(),
                        user_id: userId,
                        user_name: userName,
                        badge: badge,
                        create_at: new Date(Date.now()),
                        post_id: postId,
                        profile_image: profileImage,
                        text: commentData,
                        origin: true,
                        reply: [],
                      } as CommentProps;

                      return [...state, newComment];
                    });

                    //코멘트 수 낙관적 업데이트
                    const postBottomCommentCountElement = document
                      .getElementById(`${postId}-bottom-bar`)
                      ?.querySelector(".fa-solid.fa-comment")
                      ?.closest("div")
                      ?.querySelector("p");
                    if (postBottomCommentCountElement) {
                      postBottomCommentCountElement.textContent = (
                        +postBottomCommentCountElement.textContent! + 1
                      ).toString();
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}
        {/*Post Comments Area*/}
        <div
          id="comments"
          className="flex flex-col gap-4 w-full max-w-200 px-8 pt-6 pb-3 mx-auto"
        >
          {commentList.map((comment, idx) => (
            <Comment key={idx} {...comment} />
          ))}
        </div>
      </div>
    </div>
  );
}

function checkTextfieldMaxLine(
  textarea: HTMLTextAreaElement,
  MAX_LINE_COUNT: number
) {
  const line = textarea.value.split("\n");
  if (line.length > MAX_LINE_COUNT) {
    line[MAX_LINE_COUNT - 1] = `${line[MAX_LINE_COUNT - 1]}${
      line[MAX_LINE_COUNT]
    }`;
    textarea.value = line.slice(0, MAX_LINE_COUNT).join("\n");
  }
}
