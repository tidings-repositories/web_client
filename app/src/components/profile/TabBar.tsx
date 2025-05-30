//외부에 인덱스 의존하기

type TabBarProps = {
  child: React.ReactNode;
};

function TabBar({ child }: TabBarProps) {
  return (
    <div className="w-[98vw] max-w-173 min-h-14 mx-auto flex border-b-2 border-solid border-gray-300">
      {child}
    </div>
  );
}

export default TabBar;
