type AppBarProps = {
  child: React.ReactNode;
};

function AppBar({ child }: AppBarProps) {
  return (
    <div
      id="appbar"
      className="fixed w-full h-14 px-4 bg-white border-solid border-b-2 border-gray-100 z-50 content-center"
    >
      {child}
    </div>
  );
}

export default AppBar;
