import { useEffect, useState } from "react";
import { PostMediaStructure } from "../../Types";
import { useSwipeable } from "react-swipeable";

type MediaContentProps = {
  contents: PostMediaStructure[];
  post_id: string;
};

function MediaContent({ contents, post_id }: MediaContentProps) {
  const [mediaIndex, setState] = useState(0);
  const userAgent = navigator.userAgent.toLowerCase();
  const isDesktop = !/mobile|tablet|ip(ad|hone|od)|android/i.test(userAgent);

  useEffect(() => {
    const removeHandler = isDesktop
      ? desktopMediaSwapEvent(post_id)
      : mobileVideoPauseAndPlayEvent(post_id);

    return () => {
      removeHandler();
    };
  });

  const mobileMediaSwapEvent = useSwipeable({
    onSwipedLeft: () => {
      if (mediaIndex < contents.length - 1) setState((prev) => prev + 1);

      //preload
      if (mediaIndex + 1 < contents.length - 1)
        preloadNextMedia(contents[mediaIndex + 2]);
    },

    onSwipedRight: () => {
      if (mediaIndex > 0) setState((prev) => prev - 1);
    },
    preventScrollOnSwipe: true,
  });

  return (
    <div
      {...mobileMediaSwapEvent}
      id={`${post_id}-media`}
      className="relative z-0 max-w-auto h-120 bg-black rounded-xl overflow-hidden"
    >
      <MediaComponent content={contents[mediaIndex]} isDesktop={isDesktop} />

      {/*Media Index*/}
      {contents.length != 0 && (
        <div className="absolute p-0.125 px-2 top-0 right-0 z-10 bg-neutral-800 opacity-80 text-white rounded-lg content-center text-center mx-4 my-4">
          {mediaIndex + 1} / {contents.length}
        </div>
      )}

      {/*Start of Desktop Media Navigator*/}
      {isDesktop && (
        <>
          <div
            id={`${post_id}-media-navigator`}
            className="h-0"
            style={{ display: "none" }}
          >
            {mediaIndex >= 1 && (
              <button
                onClick={() => {
                  setState((prev) => prev - 1);
                }}
              >
                <div
                  className="absolute w-16 h-1/2 z-3 inset-0 my-auto mr-auto opacity-50 content-center text-center"
                  style={{
                    backgroundImage:
                      "radial-gradient(closest-side, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0))",
                  }}
                >
                  <i
                    className="fa-solid fa-chevron-left"
                    style={{ color: "white", scale: "150%" }}
                  ></i>
                </div>
              </button>
            )}
            {mediaIndex < contents.length - 1 && (
              <button
                onClick={() => {
                  if (mediaIndex < contents.length - 1)
                    setState((prev) => prev + 1);

                  //preload
                  if (mediaIndex + 1 < contents.length - 1)
                    preloadNextMedia(contents[mediaIndex + 2]);
                }}
              >
                <div
                  className="absolute w-16 h-1/2 z-3 inset-0 my-auto ml-auto opacity-50 content-center text-center"
                  style={{
                    backgroundImage:
                      "radial-gradient(closest-side, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0))",
                  }}
                >
                  <i
                    className="fa-solid fa-chevron-right"
                    style={{ color: "white", scale: "150%" }}
                  ></i>
                </div>
              </button>
            )}
          </div>
        </>
      )}
      {/*End of Media Navigator*/}
    </div>
  );
}

type MediaComponentProps = {
  content: PostMediaStructure;
  isDesktop: boolean;
};

function MediaComponent({ content, isDesktop }: MediaComponentProps) {
  return (
    <>
      {/*Image Type*/}
      {content.type === "image" && (
        <>
          <img
            className="relative w-full h-full z-1 object-contain rounded-xl blur-none"
            src={content.url}
          />
          {/*background*/}
          <div
            className="absolute z-0 top-0 w-full h-full blur-lg brightness-50"
            style={{
              backgroundImage: `url(${content.url})`,
              backgroundSize: "150%",
              backgroundPosition: "center",
            }}
          ></div>
        </>
      )}
      {/*Video Type*/}
      {content.type === "video" && (
        <>
          <video
            controls
            playsInline
            autoPlay={isDesktop}
            muted
            className="relative w-full h-full z-1 object-contain rounded-xl blur-none pointer-events-none"
            src={content.url}
          />
          <div className="absolute z-0 top-0 w-full h-full bg-black brightness-50"></div>
        </>
      )}
    </>
  );
}

/*------------------*/

function desktopMediaSwapEvent(post_id: string) {
  const thisComponent = document.getElementById(`${post_id}-media`);
  const overEvent = () => {
    document.getElementById(`${post_id}-media-navigator`)!.style.display =
      "block";
  };
  const outEvent = () => {
    document.getElementById(`${post_id}-media-navigator`)!.style.display =
      "none";
  };

  thisComponent!.addEventListener("mouseover", overEvent);
  thisComponent!.addEventListener("mouseout", outEvent);

  function removeEvent() {
    thisComponent?.removeEventListener("mouseover", overEvent);
    thisComponent?.removeEventListener("mouseout", outEvent);
  }

  return removeEvent;
}

function mobileVideoPauseAndPlayEvent(post_id: string) {
  const thisComponent = document.getElementById(`${post_id}-media`);

  const pauseAndPlayEvent = () => {
    const videoComponent = thisComponent?.querySelector("video");

    if (videoComponent?.paused) videoComponent?.play();
    else videoComponent?.pause();
  };

  thisComponent!.addEventListener("click", pauseAndPlayEvent);

  function removeEvent() {
    thisComponent?.removeEventListener("click", pauseAndPlayEvent);
  }

  return removeEvent;
}

function preloadNextMedia(content: PostMediaStructure) {
  if (content.type === "image") {
    const img = new Image();
    img.src = content.url;
  } else if (content.type === "video") {
    //비디오의 경우 metadata만 preload
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = content.url;
    video.load();
  }
}

export default MediaContent;
