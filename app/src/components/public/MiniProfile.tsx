import { useNavigate } from "react-router-dom";

type MiniProfileProps = {
  user_id: string;
  img_url: string;
};

function MiniProfile({ user_id, img_url }: MiniProfileProps) {
  const navigator = useNavigate();

  return (
    <button
      className="!min-w-12 !min-h-12 !p-0 !flex !justify-center !items-center"
      onClick={(event) => {
        event.stopPropagation();
        navigator(`/profile/${user_id}`);
      }}
    >
      <img
        className="rounded-xl w-10 h-10"
        style={{ objectFit: "cover" }}
        src={img_url}
      />
    </button>
  );
}

export default MiniProfile;
