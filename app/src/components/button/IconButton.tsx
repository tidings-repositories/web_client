type IconButtonProps = {
  icon: string;
  onPressed: () => void;
};

function IconButton({ icon, onPressed }: IconButtonProps) {
  return (
    <button onClick={onPressed}>
      <div className={`flex items-center text-gray-500 font-light`}>
        <i className={icon}></i>
      </div>
    </button>
  );
}

export default IconButton;
