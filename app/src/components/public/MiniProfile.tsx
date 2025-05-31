import { useNavigate } from "react-router-dom";

type MiniProfileProps = {
  user_id: string;
  img_url: string;
};

function MiniProfile({ user_id, img_url }: MiniProfileProps) {
  const navigator = useNavigate();

  return (
    <button
      className="!p-1"
      onClick={(event) => {
        event.stopPropagation();
        navigator(`/profile/${user_id}`);
      }}
    >
      <img
        className="rounded-xl max-w-10 max-h-10"
        style={{ objectFit: "cover" }}
        src={img_url}
      />
    </button>
  );
}

export default MiniProfile;
