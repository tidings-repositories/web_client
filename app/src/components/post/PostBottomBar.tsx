import {
  requestDELETEWithToken,
  requestPOSTWithToken,
} from "../../scripts/requestWithToken";
import useLikePostStore from "../../store/LikePostStore";
import useUserDataStore from "../../store/UserDataStore";
import { PostBottom } from "../../Types";
import MixedButton from "../button/MixedButton";
import { useNavigate } from "react-router-dom";

function PostBottomBar({
  origin,
  post_id,
  user_id,
  comment_count,
  like_count,
  scrap_count,
}: PostBottom) {
  const userId = useUserDataStore((state) => state.user_id);
  const likePostTable = useLikePostStore((state) => state.likePostTable);
  const addLikePost = useLikePostStore((state) => state.add);
  const removeLikePost = useLikePostStore((state) => state.remove);

  const navigator = useNavigate();

  const commentEvent = (e: Event) => {
    e.stopPropagation();
    //window.location 검사해서 포스트 페이지면 무반응, 아니라면 포스트 페이지로 이동
    const firstPath = window.location.pathname.split("/")[1] ?? "";
    if (firstPath !== "post") navigator(`/post/${post_id}`);
  };

  const likeEvent = async (e: Event) => {
    e.stopPropagation();
    if (userId == null || userId == user_id) return;

    const OK = 200;
    const isLiked = likePostTable && likePostTable[post_id];
    const textElement = (e.currentTarget as HTMLButtonElement).querySelector(
      "p"
    )!;

    if (isLiked) {
      removeLikePost(post_id);
      textElement.textContent = (+textElement.textContent! - 1).toString();
      const resposne = await requestDELETEWithToken(
        `${import.meta.env.VITE_API_URL}/post/${post_id}/like`
      ).catch((_) => _);
      if (resposne.status != OK) addLikePost(post_id);
    } else {
      addLikePost(post_id);
      textElement.textContent = (+textElement.textContent! + 1).toString();
      const resposne = await requestPOSTWithToken(
        `${import.meta.env.VITE_API_URL}/post/${post_id}/like`,
        {}
      ).catch((_) => _);
      if (resposne.status != OK) removeLikePost(post_id);
    }
  };

  const scrapEvent = async (e: Event) => {
    e.stopPropagation();
    if (userId == null || userId == user_id) return;

    const CREATED = 201;
    const response = await requestPOSTWithToken(
      `${import.meta.env.VITE_API_URL}/post/${post_id}/scrap`,
      {}
    ).catch((_) => _);

    if (response.status == CREATED) navigator(`/profile/${userId}`);
  };

  return (
    <div
      id={`${post_id}-bottom-bar`}
      className="w-full h-fit flex justify-around"
    >
      <MixedButton
        icon="fa-solid fa-comment"
        text={comment_count}
        gap={1}
        onPressed={commentEvent}
      />
      {origin && (
        <MixedButton
          icon="fa-solid fa-heart"
          text={like_count}
          color={
            likePostTable && likePostTable[post_id] ? "lightcoral" : "gray"
          }
          gap={1}
          onPressed={likeEvent}
        />
      )}
      <MixedButton
        icon="fa-solid fa-repeat"
        text={origin ? scrap_count : ""}
        gap={1}
        onPressed={scrapEvent}
      />
    </div>
  );
}

export default PostBottomBar;
