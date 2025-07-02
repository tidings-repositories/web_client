import { BadgeProps } from "../../Types";
import SimpleUserSlot from "./SimpleUserSlot";
import { useNavigate } from "react-router-dom";
import FollowButton from "../profile/FollowButton";

type UserSlotProps = {
  user_id: string;
  user_name: string;
  profile_image: string;
  badge: BadgeProps | null;
  bio: string;
};

function UserSlot({ ...userInfo }: UserSlotProps) {
  const navigator = useNavigate();

  return (
    <div
      role="button"
      className="flex flex-col py-2 hover:bg-gray-100 cursor-pointer overflow-hidden"
      onClick={(event) => {
        event.stopPropagation();
        navigator(`/profile/${userInfo.user_id}`);
      }}
    >
      <div className="flex justify-between pr-1">
        <SimpleUserSlot {...userInfo} />
        <FollowButton thisUserId={userInfo.user_id} />
      </div>
      <p
        className="pl-14 pr-1 pb-1"
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxLines: 2,
        }}
      >
        {userInfo.bio}
      </p>
    </div>
  );
}

export default UserSlot;
