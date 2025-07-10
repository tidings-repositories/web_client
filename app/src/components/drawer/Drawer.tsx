import { useEffect } from "react";

type DrawerProps = {
  child: React.ReactNode;
};

function Drawer({ child }: DrawerProps) {
  const closeDrawer = () => {
    const drawerComponent = document.getElementById("drawer")!;
    drawerComponent.style.display = "none";
  };

  const drawerClickEvent = (e: Event) => {
    if ((e.target as HTMLElement).id == "drawer-background") closeDrawer();
  };

  useEffect(() => {
    const drawerComponent = document.getElementById("drawer")!;

    drawerComponent.addEventListener("click", drawerClickEvent);
  }, []);

  return (
    <div id="drawer" className="hidden">
      {/*background*/}
      <div
        id="drawer-background"
        className="fixed top-0 right-0 bottom-0 left-0 bg-black/50 z-49 content-start"
      >
        {/*drawer*/}
        <div className="bg-white opacity-100 h-full w-70 flex flex-col p-2 py-18 rounded-r-xl">
          {child}
        </div>
      </div>
    </div>
  );
}

export default Drawer;
