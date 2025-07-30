import IconButton from "../button/IconButton";
import { useEffect } from "react";

type DialogProps = {
  child: React.ReactNode;
};

function Dialog({ child }: DialogProps) {
  let isClick = false;
  let isDragging = false;

  const handleMouseDown = () => {
    isClick = true;
    isDragging = false;
  };

  const handleMouseMove = () => {
    if (isClick) isDragging = true;
  };

  const handleMouseUp = () => {
    isClick = false;
    setTimeout(() => {
      isDragging = false;
    }, 0);
  };

  const scrollY = window.scrollY;
  const preventScrollEvent = () => {
    window.scrollTo(0, scrollY);
  };

  const closeDialog = () => {
    if (!isDragging) {
      const dialogComponent = document.getElementById("dialog-box")!;
      const childComponent = document.getElementById("child-area")!;

      childComponent.removeEventListener("mousedown", handleMouseDown);

      dialogComponent.removeEventListener("click", dialogClickEvent);
      dialogComponent.removeEventListener("mousemove", handleMouseMove);
      dialogComponent.removeEventListener("mouseup", handleMouseUp);

      document.removeEventListener("scroll", preventScrollEvent);

      dialogComponent!.remove();
    }
  };

  const dialogClickEvent = (e: Event) => {
    if ((e.target as HTMLElement).id == "dialog-background") closeDialog();
  };

  useEffect(() => {
    const dialogComponent = document.getElementById("dialog-box")!;
    const childComponent = document.getElementById("child-area")!;

    childComponent.addEventListener("mousedown", handleMouseDown);

    dialogComponent.addEventListener("click", dialogClickEvent);
    dialogComponent.addEventListener("mousemove", handleMouseMove);
    dialogComponent.addEventListener("mouseup", handleMouseUp);

    document.addEventListener("scroll", preventScrollEvent);
  }, []);

  return (
    <div id="dialog">
      {/*background*/}
      <div
        id="dialog-background"
        className="fixed top-0 right-0 bottom-0 left-0 bg-black/50 z-100 content-center"
      >
        {/*modal*/}
        <div className="bg-white max-w-132 flex flex-col py-4 mx-auto rounded-xl">
          {/*toolbar*/}
          <div className="flex justify-between pt-4 pb-2 px-6">
            <div></div>
            <IconButton icon="xmark" size={24} onPressed={closeDialog} />
          </div>
          {/*child component*/}
          <div id="child-area" className="px-4 ">
            {" "}
            {child}{" "}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dialog;
