type DividerProps = {
  thickness: number;
};

function Divider({ thickness }: DividerProps) {
  return <div className={`w-49/50 h-${thickness} mx-auto bg-gray-300`}></div>;
}

export default Divider;
