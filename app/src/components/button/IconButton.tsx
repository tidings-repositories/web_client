type IconButtonProps = {
  icon: string;
  size?: number;
  color?: string;
  onPressed: () => void;
};

function IconButton({ icon, size, color, onPressed }: IconButtonProps) {
  return (
    <button onClick={onPressed}>
      <div className={`flex items-center text-gray-500 font-light`}>
        <i
          className={icon}
          style={{ fontSize: size ?? 16, color: color ?? "" }}
        ></i>
      </div>
    </button>
  );
}

export default IconButton;
