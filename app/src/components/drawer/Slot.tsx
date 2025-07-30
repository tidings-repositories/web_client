import { Icons } from "../button/IconButton";
import iconPack from "../public/IconPack";

type SlotProps = {
  icon?: Icons;
  text: string;
  color?: string;
  behavior: (e?: any) => void;
};

function Slot({ icon, text, color = "black", behavior }: SlotProps) {
  return (
    <button className="!p-0 " onClick={behavior}>
      <div className="flex w-full gap-4 py-2 px-4 rounded-lg hover:bg-gray-100 items-center">
        {icon && (
          <svg
            style={{
              width: 16,
              height: 16,
              color: color,
            }}
          >
            {iconPack(icon)}
          </svg>
        )}
        <p className="text-lg" style={{ color: color }}>
          {text}
        </p>
      </div>
    </button>
  );
}

export default Slot;
