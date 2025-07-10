import * as l10n from "i18next";
import useFollowingUserStore from "../../store/FollowingUserStore";
import OutlineButton from "../button/OutlineButton";
import useUserDataStore from "../../store/UserDataStore";
import {
  requestDELETEWithToken,
  requestPOSTWithToken,
} from "../../scripts/requestWithToken";

type FollowButtonProps = {
  thisUserId: string;
};

function FollowButton({ thisUserId }: FollowButtonProps) {
  const userId = useUserDataStore((state) => state.user_id);
  const followingTable = useFollowingUserStore(
    (state) => state.followingIdTable
  );
  const addFollowing = useFollowingUserStore((state) => state.add);
  const removeFollowing = useFollowingUserStore((state) => state.remove);

  return userId ? (
    <OutlineButton
      text={l10n.t(
        followingTable && followingTable[thisUserId] ? "unfollow" : "follow"
      )}
      color="gray"
      fontSize="base"
      radius={16}
      onPressed={(e) => {
        e.stopPropagation();

        followingTable && followingTable[thisUserId]
          ? removeFollowing(thisUserId)
          : addFollowing(thisUserId);

        console.log(followingTable);
        if (followingTable && followingTable[thisUserId]) {
          requestDELETEWithToken(
            `${import.meta.env.VITE_API_URL}/follow/${thisUserId}`
          ).catch((_) => addFollowing(thisUserId));
        } else {
          requestPOSTWithToken(
            `${import.meta.env.VITE_API_URL}/follow/request`,
            {
              follow: thisUserId,
            }
          ).catch((_) => removeFollowing(thisUserId));
        }
      }}
    />
  ) : (
    <></>
  );
}

export default FollowButton;
