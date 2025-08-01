import { useEffect } from "react";

type pos = {
  x: number;
  y: number;
};

type DropdownProps = {
  id: string;
  position: pos;
  child: React.ReactNode;
};

function Dropdown({ id, position, child }: DropdownProps) {
  useEffect(() => {
    const thisElement = document.getElementById(id)!;
    const rect = thisElement.getBoundingClientRect();
    const eventHandler = (e: MouseEvent) =>
      closeDropdownEvent(e, id, eventHandler);
    document.addEventListener("mousedown", eventHandler);

    thisElement.style.top = `${position.y + window.scrollY}px`;
    thisElement.style.left = `${position.x - rect.width}px`;
    thisElement.style.visibility = "visible";
  }, []);

  return (
    <div
      id={id}
      className="invisible absolute py-1 bg-gray-200 z-20 content-center rounded-lg"
    >
      {child}
    </div>
  );
}

function closeDropdownEvent(e, id, eventHandler: (e: MouseEvent) => void) {
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
    document.removeEventListener("mousedown", eventHandler);
    document.getElementById(`${id}-box`)?.remove();
  }
}

type DropdownSlotProps = {
  text: string;
  extraBeforeNode?: React.ReactNode;
  extraAfterNode?: React.ReactNode;
  behavior: (e?: any) => void;
};

export function DropwdownSlot({
  text,
  extraBeforeNode,
  extraAfterNode,
  behavior,
}: DropdownSlotProps) {
  return (
    <button className="!p-0" onClick={behavior}>
      <div className="flex w-full gap-1 py-1 px-4 rounded-lg hover:bg-white items-center">
        {extraBeforeNode}
        <p className="text-base">{text}</p>
        {extraAfterNode}
      </div>
    </button>
  );
}

export default Dropdown;
