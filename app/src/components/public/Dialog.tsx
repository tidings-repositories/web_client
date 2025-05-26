import IconButton from "../button/IconButton";
import { useEffect } from "react";

type DialogProps = {
  child: React.ReactNode;
};

function Dialog({ child }: DialogProps) {
  const closeDialog = () => {
    const dialogComponent = document.getElementById("dialog")!;
    dialogComponent.removeEventListener("click", dialogClickEvent);
    dialogComponent!.remove();
  };

  const dialogClickEvent = (e: Event) => {
    if ((e.target as HTMLElement).id == "dialog-background") closeDialog();
  };

  useEffect(() => {
    const dialogComponent = document.getElementById("dialog")!;

    dialogComponent.addEventListener("click", dialogClickEvent);
  }, []);

  return (
    <div id="dialog">
      {/*background*/}
      <div
        id="dialog-background"
        className="fixed top-0 right-0 bottom-0 left-0 bg-black/50 z-100 content-center"
      >
        {/*modal*/}
        <div className="bg-white w-132 max-w-200 flex flex-col py-4 mx-auto rounded-xl">
          {/*toolbar*/}
          <div className="flex justify-between items-end pt-4 pb-2 px-6">
            <div></div>
            <IconButton
              icon="fa-solid fa-xmark-circle"
              size={24}
              onPressed={closeDialog}
            />
          </div>
          {/*child component*/}
          <div className="px-4 "> {child} </div>
        </div>
      </div>
    </div>
  );
}

export default Dialog;
