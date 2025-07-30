import iconPack from "../public/IconPack";
import { Icons } from "./IconButton";

type MixedButtonProps = {
  icon: Icons;
  text: string | number;
  color?: string;
  gap: number;
  onPressed: (e?: any) => void;
};

function MixedButton({ icon, text, color, gap, onPressed }: MixedButtonProps) {
  return (
    <button onClick={onPressed}>
      <div className={`flex items-center gap-${gap} text-gray-500 font-light`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: 16,
            height: 16,
            color: color ?? "gray",
          }}
        >
          {iconPack(icon)}
        </svg>
        <p>{text}</p>
      </div>
    </button>
  );
}

export default MixedButton;
