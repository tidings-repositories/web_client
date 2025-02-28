import { useEffect, useState } from "react";
import { PostMediaStructure } from "../../Types";

type MediaContentProps = {
  contents: PostMediaStructure[];
  post_id: string;
};

function MediaContent({ contents, post_id }: MediaContentProps) {
  const [mediaIndex, setState] = useState(0);
  const userAgent = navigator.userAgent.toLowerCase();
  const isDesktop = !/mobile|tablet|ip(ad|hone|od)|android/i.test(userAgent);

  useEffect(() => {
    const removeHandler = isDesktop ? desktopMediaSwapEvent(post_id) : () => {};
    if (!isDesktop)
      document.getElementById(`${post_id}-media-navigator`)!.style.display =
        "block";

    return () => {
      removeHandler();
    };
  });

  return (
    <div
      id={`${post_id}-media`}
      className="relative z-0 max-w-auto max-h-120 bg-black rounded-xl overflow-hidden"
    >
      {/*Image Type*/}
      {contents[mediaIndex].type === "image" && (
        <>
          <div
            className="absolute z-0 top-0 w-full h-full blur-lg brightness-50"
            style={{
              backgroundImage: `url(${contents[mediaIndex].url})`,
              backgroundSize: "150%",
              backgroundPosition: "center",
            }}
          ></div>
          <img
            className="relative w-full h-full z-1 object-contain rounded-xl blur-none"
            src={contents[mediaIndex].url}
          />
        </>
      )}
      {/*Video Type*/}
      {contents[mediaIndex].type === "video" && (
        <>
          <div className="absolute z-0 top-0 w-full h-full bg-black brightness-50"></div>
          <video
            controls
            autoPlay={isDesktop}
            muted
            className="relative w-full h-full z-1 object-contain rounded-xl blur-none"
            src={contents[mediaIndex].url}
          />
        </>
      )}
      {contents.length != 0 && (
        <div className="absolute p-0.125 px-2 top-0 right-0 z-10 bg-neutral-800 opacity-80 text-white rounded-lg content-center text-center mx-4 my-4">
          {mediaIndex + 1} / {contents.length}
        </div>
      )}

      {/*Media Navigator Start*/}
      <div
        id={`${post_id}-media-navigator`}
        className="h-0"
        style={{ display: "none" }}
      >
        {mediaIndex >= 1 && (
          <button
            onClick={() => {
              setState(mediaIndex - 1);
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
              if (mediaIndex < contents.length - 1) setState(mediaIndex + 1);
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
      {/*Media Navigator End*/}
    </div>
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

export default MediaContent;
