import { useEffect } from "react";
import { createPortal } from "react-dom";

type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

function Drawer({ open, onOpenChange, children }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  if (!open) return null;

  return createPortal(
    <div className="fixed top-0 right-0 bottom-0 left-0 z-49">
      {/*backdrop*/}
      <div
        className="absolute top-0 right-0 bottom-0 left-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      {/*panel*/}
      <div className="relative bg-white h-full w-70 flex flex-col p-2 py-18 rounded-r-xl">
        {children}
      </div>
    </div>,
    document.body
  );
}

export default Drawer;
