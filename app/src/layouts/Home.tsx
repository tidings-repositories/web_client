import { Post } from "../Types";
import Content from "../components/post/Content";

const testData: Post = {
  post_id: "124124124",
  user_id: "@test1",
  user_name: "지능이 떨어지는 브금",
  profile_image:
    "https://ssl.pstatic.net/cmstatic/nng/img/img_anonymous_square_gray_opacity2x.png",
  badge: "https://ssl.pstatic.net/static/nng/glive/badge/fan_03.png",
  create_at: new Date("2025-01-25"),
  content: {
    text: "이번에 그린 그림인데 어때?",
    media: [
      {
        type: "image",
        url: "https://pbs.twimg.com/media/GkonMv3bkAUZTGY?format=jpg&name=small",
      },
      {
        type: "image",
        url: "https://preview.redd.it/this-stoat-lives-under-my-cabin-and-it-is-really-useful-as-v0-anj7115x9cle1.jpeg?width=640&crop=smart&auto=webp&s=04f0feaa9c05ad83533730335ec53a39c887403d",
      },
      {
        type: "video",
        url: "https://packaged-media.redd.it/rehwyyl1s9le1/pb/m2-res_854p.mp4?m=DASHPlaylist.mpd&v=1&e=1740499200&s=e92623aa26b05380da27aabc9598d3e0457f3df6#t=0.767031",
      },
      {
        type: "image",
        url: "https://preview.redd.it/aio-i-literally-cannot-attend-v0-7bnft6y0ucle1.jpg?width=1170&format=pjpg&auto=webp&s=03e20aa71489199dea48e5ead9bbf70fca2f10d5",
      },
    ],
  },
};
export default function Home() {
  return (
    <>
      <div id="home">
        <Content {...testData} />
      </div>
    </>
  );
}
