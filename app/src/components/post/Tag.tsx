type TagProps = {
  content: string;
};

function Tag({ content }: TagProps) {
  return (
    <div
      className={`px-3 py-1 rounded-lg border-2 border-solid border-gray-300`}
    >
      <p className={`text-base text-gray-500`}>{`#${content}`}</p>
    </div>
  );
}

export default Tag;
