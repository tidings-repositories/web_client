import { forwardRef } from "react";
import iconPack from "../public/IconPack";

export type Icons =
  | "agreement"
  | "comment"
  | "compose"
  | "coupon"
  | "hashtag"
  | "image"
  | "like"
  | "menu"
  | "more"
  | "person"
  | "person-slash"
  | "privacy"
  | "scrap"
  | "search"
  | "setting"
  | "signout"
  | "stellagram"
  | "xmark"
  | "paper-plane"
  | "chevron-left"
  | "chevron-right"
  | "chevron-up"
  | "bell"
  | "message"
  | "check"
  | "normal-xmark"
  | "flag"
  | "trash";

type IconButtonProps = {
  icon: Icons;
  size?: number;
  color?: string;
  onPressed: (e: any) => void;
};

const IconButton = forwardRef<
  HTMLButtonElement,
  IconButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ icon, size, color, onPressed, onClick, ...rest }, ref) => {
  return (
    <button
      ref={ref}
      {...rest}
      onClick={(e) => {
        onPressed(e);
        onClick?.(e);
      }}
    >
      <div className={`flex items-center`}>
        <svg
          aria-hidden="true"
          style={{
            width: size ?? 16,
            height: size ?? 16,
            color: color ?? "gray",
          }}
        >
          {iconPack(icon)}
        </svg>
      </div>
    </button>
  );
});

export default IconButton;
