import MiniProfile from "./MiniProfile";
import Badge from "../profile/Badge";
import { BadgeProps } from "../../Types";
import { useNavigate } from "react-router-dom";

type SimpleUserSlotProps = {
  user_id: string;
  user_name: string;
  profile_image: string;
  badge: BadgeProps | null;
};

function SimpleUserSlot({ ...userInfo }: SimpleUserSlotProps) {
  const navigator = useNavigate();

  return (
    <div
      role="button"
      className="flex justify-start gap-1 pl-1 pr-2 rounded-lg hover:bg-gray-100 cursor-pointer"
      onClick={(event) => {
        event.stopPropagation();
        navigator(`/profile/${userInfo.user_id}`);
      }}
    >
      <MiniProfile
        img_url={userInfo.profile_image}
        user_id={userInfo.user_id}
      />
      <div className="flex flex-col justify-center overflow-hidden">
        <div className="flex items-center gap-1">
          <p
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {userInfo.user_name}
          </p>
          {userInfo.badge && <Badge {...userInfo.badge} />}
        </div>
        <p
          className="text-sm text-gray-500"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          @{userInfo.user_id}
        </p>
      </div>
    </div>
  );
}

export default SimpleUserSlot;
