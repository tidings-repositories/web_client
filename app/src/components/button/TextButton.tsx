type TextButtonProps = {
  fontSize: string;
  text: string;
  color: string;
  onPressed: () => void;
};

function TextButton({ fontSize, text, color, onPressed }: TextButtonProps) {
  return (
    <button onClick={onPressed}>
      <p className={`text-${fontSize} text-${color}`}>{text}</p>
    </button>
  );
}

export default TextButton;
