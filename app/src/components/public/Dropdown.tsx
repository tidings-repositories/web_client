import { DropdownMenu } from "radix-ui";

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
    <DropdownMenu.Item
      onSelect={behavior}
      className="flex w-full gap-1 py-1 px-4 rounded-lg hover:bg-white items-center outline-none cursor-pointer"
    >
      {extraBeforeNode}
      <p className="text-base">{text}</p>
      {extraAfterNode}
    </DropdownMenu.Item>
  );
}
