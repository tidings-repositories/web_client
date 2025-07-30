import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { PostMediaStructure } from "../../Types";
import { useSwipeable } from "react-swipeable";
import FullScreenImageViewer from "../public/FullScreenImageViewer";
import iconPack from "../public/IconPack";

type MediaContentProps = {
  contents: PostMediaStructure[];
  post_id: string;
  context?: { index: number };
};

function MediaContent({ contents, post_id, context }: MediaContentProps) {
  const [mediaIndex, setState] = useState(0);
  const userAgent = navigator.userAgent.toLowerCase();
  const isDesktop = !/mobile|tablet|ip(ad|hone|od)|android/i.test(userAgent);

  if (mediaIndex >= contents.length) setState(contents.length - 1);
  if (context != null) context.index = mediaIndex;

  useEffect(() => {
    if (isDesktop) {
      const removeHandler = desktopMediaSwapEvent(post_id);

      return () => {
        removeHandler();
      };
    }
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
      className="relative grid max-w-auto h-full max-h-120 z-0 bg-transparent rounded-xl overflow-hidden"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        className="!p-0 !w-full !h-full"
        style={{
          cursor: contents[mediaIndex].type == "image" ? "pointer" : "auto",
        }}
        onClick={() => {
          if (contents[mediaIndex].type == "image")
            viewImageFullScreen(contents[mediaIndex].url);
        }}
      >
        <MediaComponent content={contents[mediaIndex]} isDesktop={isDesktop} />
      </button>

      {/*Media Index*/}
      {contents.length > 1 && (
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
                onClick={(event) => {
                  event.stopPropagation();
                  setState((prev) => prev - 1);
                }}
              >
                <div
                  className="absolute w-16 h-1/2 z-3 inset-0 my-auto mr-auto opacity-70 content-center"
                  style={{
                    backgroundImage:
                      "radial-gradient(closest-side, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0))",
                  }}
                >
                  <svg
                    className="mx-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      width: 24,
                      height: 24,
                      color: "white",
                      scale: "150%",
                    }}
                  >
                    {iconPack("chevron-left")}
                  </svg>
                </div>
              </button>
            )}
            {mediaIndex < contents.length - 1 && (
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  if (mediaIndex < contents.length - 1)
                    setState((prev) => prev + 1);

                  //preload
                  if (mediaIndex + 1 < contents.length - 1)
                    preloadNextMedia(contents[mediaIndex + 2]);
                }}
              >
                <div
                  className="absolute w-16 h-1/2 z-3 inset-0 my-auto ml-auto opacity-70 content-center"
                  style={{
                    backgroundImage:
                      "radial-gradient(closest-side, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0))",
                  }}
                >
                  <svg
                    className="mx-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      width: 24,
                      height: 24,
                      color: "white",
                      scale: "150%",
                    }}
                  >
                    {iconPack("chevron-right")}
                  </svg>
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
            loading="lazy"
            className="relative w-full h-full max-h-120 z-1 object-contain blur-none"
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
            onTouchEnd={(e) => {
              const videoElement = e.target as HTMLVideoElement;
              mobileVideoPauseAndPlayEvent(videoElement);
            }}
            className="relative w-full h-full max-h-120 z-1 object-contain blur-none"
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

function mobileVideoPauseAndPlayEvent(videoComponent: HTMLVideoElement) {
  if (videoComponent!.paused) videoComponent!.play();
  else videoComponent!.pause();
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

function viewImageFullScreen(url) {
  const newDialog = document.createElement("div");
  newDialog.id = "fullscreen-image-box";
  document.querySelector("body")!.appendChild(newDialog);
  const root = ReactDOM.createRoot(newDialog);
  root.render(<FullScreenImageViewer url={url} />);
}

export default MediaContent;
