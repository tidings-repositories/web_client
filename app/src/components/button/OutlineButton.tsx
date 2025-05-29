type OutlineButtonProps = {
  fontSize: string;
  text: string;
  color: string;
  fontColor?: string;
  backgroundColor?: string;
  radius: number;
  onPressed: () => void;
};

function OutlineButton({
  fontSize,
  text,
  color,
  fontColor = "black",
  backgroundColor = "transparent",
  radius,
  onPressed,
}: OutlineButtonProps) {
  return (
    <button onClick={onPressed}>
      <div
        className={`px-3 py-1 min-x-1 min-h-1 border-2 border-solid `}
        style={{
          borderRadius: `${radius}px`,
          borderColor: `${color}`,
          backgroundColor: backgroundColor,
        }}
      >
        <p className={`text-${fontSize} text-${fontColor}`}>{text}</p>
      </div>
    </button>
  );
}

export default OutlineButton;
