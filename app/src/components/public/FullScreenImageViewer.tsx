import { useEffect } from "react";
import IconButton from "../button/IconButton";

type FullScreenImageViewerProps = {
  url: string;
};

function FullScreenImageViewer({ url }: FullScreenImageViewerProps) {
  const closeImageViewer = () => {
    const imageViewerComponent = document.getElementById(
      "fullscreen-image-box"
    )!;
    imageViewerComponent.removeEventListener("click", backgroundClickEvent);
    imageViewerComponent!.remove();
  };

  const backgroundClickEvent = (e: Event) => {
    if ((e.target as HTMLElement).id == "fullscreen-image-background")
      closeImageViewer();
  };

  useEffect(() => {
    const imageViewerComponent = document.getElementById(
      "fullscreen-image-box"
    )!;
    imageViewerComponent.addEventListener("click", backgroundClickEvent);
  }, []);

  return (
    <div id="fullscreen-image">
      {/*background*/}
      <div
        id="fullscreen-image-background"
        className="fixed flex flex-col justify-between top-0 right-0 bottom-0 left-0 p-4 bg-black/50 z-100 content-center items-end"
      >
        {/*toolbar*/}
        <div className="flex justify-between pt-4 pb-2 px-6">
          <div></div>
          <IconButton
            icon="xmark"
            size={24}
            color="white"
            onPressed={closeImageViewer}
          />
        </div>
        {/*image*/}
        <img
          className="max-w-[90vw] max-h-[80vh] m-auto object-contain blur-none"
          style={{ objectFit: "contain" }}
          src={url}
        />
        <div></div>
      </div>
    </div>
  );
}

export default FullScreenImageViewer;
