type IconButtonProps = {
  icon: string;
  size?: string;
  onPressed: () => void;
};

function IconButton({ icon, size = "base", onPressed }: IconButtonProps) {
  return (
    <button onClick={onPressed}>
      <div
        className={`flex items-center text-${size} text-gray-500 font-light`}
      >
        <i className={icon}></i>
      </div>
    </button>
  );
}

export default IconButton;
