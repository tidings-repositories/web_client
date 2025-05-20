type OutlineButtonProps = {
  fontSize: string;
  text: string;
  color: string;
  radius: string;
  onPressed: () => void;
};

function OutlineButton({
  fontSize,
  text,
  color,
  radius,
  onPressed,
}: OutlineButtonProps) {
  return (
    <button onClick={onPressed}>
      <div
        className={`px-3 py-1 min-x-1 min-h-1 rounded-${radius} border-2 border-solid border-gray-300`}
      >
        <p className={`text-${fontSize} text-${color}`}>{text}</p>
      </div>
    </button>
  );
}

export default OutlineButton;
