type TagProps = {
  content: string;
};

function Tag({ content }: TagProps) {
  let isDragging = false;
  const handleMouseDown = () => {
    isDragging = false;
  };
  const handleMouseMove = () => {
    isDragging = true;
  };

  const handleClick = (e) => {
    if (isDragging) {
      e.stopPropagation();
    }
  };

  return (
    <div
      className={`px-3 py-1 rounded-lg border-2 border-solid border-gray-300`}
    >
      <p
        className={`text-base text-gray-500 select-text cursor-text`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >{`#${content}`}</p>
    </div>
  );
}

export default Tag;
