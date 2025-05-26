import { useEffect } from "react";

type pos = {
  x: number;
  y: number;
};

type DropdownProps = {
  id: string;
  position: pos;
  direction: "LEFT" | "RIGHT";
  child: React.ReactNode;
};

function Dropdown({ id, position, direction, child }: DropdownProps) {
  useEffect(() => {
    const thisElement = document.getElementById(id)!;
    const rect = thisElement.getBoundingClientRect();
    document.addEventListener("mousedown", (e) => closeDropdownEvent(e, id));

    thisElement.style.left = `${position.x}px`;
    thisElement.style.top = `${position.y + window.scrollY}px`;
    if (direction === "LEFT") {
      const thisWidth = rect.width;
      thisElement.style.left = `${position.x - thisWidth}px`;
    }
    thisElement.style.visibility = "visible";
  }, []);

  return (
    <div
      id={id}
      className="invisible absolute py-1 bg-gray-100 z-20 content-center"
    >
      {child}
    </div>
  );
}

function closeDropdownEvent(e, id) {
  if (!document.getElementById(id)) return;

  const { left, right, top, bottom } = document
    .getElementById(id)!
    .getBoundingClientRect();

  if (
    left > e.clientX ||
    right < e.clientX ||
    top > e.clientY ||
    bottom < e.clientY
  ) {
    document.removeEventListener("mousedown", (e) => closeDropdownEvent(e, id));
    document.getElementById(`${id}-box`)?.remove();
  }
}

export default Dropdown;
