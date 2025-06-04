import { useState } from "react";
import { BadgeProps } from "../../Types";
import SimpleUserSlot from "./SimpleUserSlot";
import OutlineButton from "../button/OutlineButton";
import { useNavigate } from "react-router-dom";
import * as l10n from "i18next";
import { produce } from "immer";

type UserSlotProps = {
  user_id: string;
  user_name: string;
  profile_image: string;
  badge: BadgeProps | null;
  bio: string;
};

function UserSlot({ ...userInfo }: UserSlotProps) {
  //TODO: replace whole area following object state

  const [followingUsers, setFollowingUsers] = useState(
    {} as { [key: string]: boolean }
  );
  const navigator = useNavigate();

  return (
    <div
      role="button"
      className="flex flex-col py-2 rounded-xl hover:bg-gray-100 cursor-pointer overflow-hidden"
      onClick={(event) => {
        event.stopPropagation();
        navigator(`/profile/${userInfo.user_id}`);
      }}
    >
      <div className="flex justify-between pr-1">
        <SimpleUserSlot {...userInfo} />
        <OutlineButton
          text={l10n.t(
            followingUsers[userInfo.user_id] ? "unfollow" : "follow"
          )}
          color="gray"
          fontSize="base"
          radius={16}
          onPressed={(event) => {
            event.stopPropagation();
            setFollowingUsers(
              produce((state) => {
                state[userInfo.user_id] = !(state[userInfo.user_id] ?? false);
              })
            );

            if (followingUsers[userInfo.user_id]) {
              console.log("언팔로우");
              //TODO: fetch 팔로잉 취소
            } else {
              console.log("팔로우");
              //TODO: fetch 팔로잉 요청
            }
          }}
        />
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
