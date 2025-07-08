type SlotProps = {
  icon?: string;
  text: string;
  color?: string;
  behavior: (e?: any) => void;
};

function Slot({ icon, text, color = "black", behavior }: SlotProps) {
  return (
    <button className="!p-0 " onClick={behavior}>
      <div className="flex w-full gap-2 py-2 px-4 rounded-lg hover:bg-gray-100 items-center">
        {icon && (
          <i
            className={icon}
            style={{
              fontSize: 16,
              color: color,
              width: 20,
              textAlign: "left",
            }}
          ></i>
        )}
        <p className="text-lg" style={{ color: color }}>
          {text}
        </p>
      </div>
    </button>
  );
}

export default Slot;
