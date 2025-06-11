import { PostBottom } from "../../Types";
import MixedButton from "../button/MixedButton";
import { useNavigate } from "react-router-dom";

function PostBottomBar({
  post_id,
  comment_count,
  like_count,
  scrap_count,
}: PostBottom) {
  const navigator = useNavigate();

  //TODO: 버튼 이벤트 설정, 전역 관리중인 `좋아요 객체`에서 포스트가 존재한다면 color: "red"
  const commentEvent = (e: Event) => {
    e.stopPropagation();
    //window.location 검사해서 포스트 페이지면 무반응, 아니라면 포스트 페이지로 이동
    const firstPath = window.location.pathname.split("/")[1] ?? "";
    if (firstPath !== "post") navigator(`/post/${post_id}`);
  };
  const likeEvent = (e: Event) => {
    e.stopPropagation();
    const iconElement = (e.currentTarget as HTMLButtonElement).querySelector(
      "i"
    )!;
    const textElement = (e.currentTarget as HTMLButtonElement).querySelector(
      "p"
    )!;

    if (iconElement.style.color == "gray") {
      iconElement.style.color = "lightcoral";
      textElement.textContent = (+textElement.textContent! + 1).toString();
    } else {
      iconElement.style.color = "gray";
      textElement.textContent = (+textElement.textContent! - 1).toString();
    }
  };
  const scrapEvent = (e: Event) => {
    e.stopPropagation();
    //TODO: 본인 포스트 생성으로 포스트 스크랩
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
      <MixedButton
        icon="fa-solid fa-heart"
        text={like_count}
        gap={1}
        onPressed={likeEvent}
      />
      <MixedButton
        icon="fa-solid fa-repeat"
        text={scrap_count}
        gap={1}
        onPressed={scrapEvent}
      />
    </div>
  );
}

export default PostBottomBar;
