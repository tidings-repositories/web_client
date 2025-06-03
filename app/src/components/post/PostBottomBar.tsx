import { PostBottom } from "../../Types";
import MixedButton from "../button/MixedButton";
import IconButton from "../button/IconButton";

/*
유저는 `좋아요` 기능을 이용했을 때 해당 포스트를 좋아요 표시 했는지, 안했는지 알 수 있어야 한다.
그런데 좋아요를 굉장히 많이 한 이용자의 경우 `좋아요` 목록을 전부 가지고 있을 경우 메모리 사용량이 굉장히 커질 것이다.
그렇다고 매 번 포스트를 읽을 때 마다 서버로부터 해당 포스트가 `좋아요` 목록에 있는지 확인한다면 서버의 리소스 사용이 커질 것이고,
네트워크 오버헤드 또는 서버의 응답 오버헤드로 인해 즉각적으로 `좋아요` 여부를 확인할 수 없을 것이다.

이를 어떻게 해결할 수 있을까..
최근 n개의 좋아요만 클라이언트에서 캐시하여 관리하고,
클라이언트에서 좋아요가 눌리지 않은 포스트를 확인할 때는 좋아요 여부를 서버로 부터 응답 받기?
*/

function PostBottomBar({
  post_id,
  comment_count,
  like_count,
  scrap_count,
}: PostBottom) {
  //TODO: 버튼 이벤트 설정, 전역 관리중인 `좋아요 객체`에서 포스트가 존재한다면 color: "red"
  const commentEvent = (e) => {};
  const likeEvent = (e: Event) => {
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
  const scrapEvent = (e) => {};
  const shareEvent = (e) => {};

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
      <IconButton icon="fa-solid fa-share" onPressed={shareEvent} />
    </div>
  );
}

export default PostBottomBar;
