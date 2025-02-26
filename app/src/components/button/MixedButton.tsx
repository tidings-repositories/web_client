type MixedButtonProps = {
  icon: string;
  text: string | number;
  color?: string;
  gap: number;
  onPressed: () => void;
};

function MixedButton({ icon, text, color, gap, onPressed }: MixedButtonProps) {
  return (
    <button onClick={onPressed}>
      <div className={`flex items-center gap-${gap} text-gray-500 font-light`}>
        <i className={icon} style={{ color: color ?? "" }}></i>
        <p>{text}</p>
      </div>
    </button>
  );
}

export default MixedButton;
