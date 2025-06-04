import { useEffect, useState } from "react";
import { UserData } from "../../Types";
import ReactDOM from "react-dom/client";
import * as l10n from "i18next";
import IconButton from "../button/IconButton";
import OutlineButton from "../button/OutlineButton";
import TextButton from "../button/TextButton";
import Dropdown from "../public/Dropdown";
import Badge from "./Badge";
import Dialog from "../public/Dialog";
import EditProfileItem from "./EditProfileItem";
import FullScreenImageViewer from "../public/FullScreenImageViewer";
import { produce } from "immer";

import { createMockProfile } from "../../../dev/mockdata"; //TODO: remove

type ProfileBarProps = {
  userId: string;
};

function ProfileBar({ userId }: ProfileBarProps) {
  const isMySelf = true; //TODO: replace to uid state
  //TODO: replace whole area following object state
  const [followingUsers, setFollowingUsers] = useState(
    {} as { [key: string]: boolean }
  );
  const [profileData, setState] = useState({} as UserData);

  useEffect(() => {
    //TODO: fetch userId UserData
    setState(createMockProfile());
  }, []);

  return (
    <div className="w-full min-h-60 px-8 py-6 mx-auto flex flex-col gap-4 border-b-2 border-solid border-gray-300">
      {/*프로필 사진, 프로필 수정(본인)/팔로우&언팔로우(타인)+DM+misc(차단, 신고 등..)*/}
      <div className="w-full flex justify-between">
        {/*profile image*/}
        <button
          className="!p-0"
          onClick={() => viewImageFullScreen(profileData.profile_image)}
        >
          <img
            id="profile-image"
            src={profileData.profile_image ?? ""}
            style={{ objectFit: "cover" }}
            className="w-30 h-30 rounded-3xl"
          />
        </button>
        {/*my item or other user item*/}
        {isMySelf ? (
          <div>
            <OutlineButton
              text={l10n.t("editProfile")}
              color="gray"
              fontSize="base"
              radius={16}
              onPressed={() => openDialog(profileData, setState)}
            />
          </div>
        ) : (
          <div className="h-fit flex gap-1">
            <IconButton
              icon="fa-solid fa-ellipsis"
              size={18}
              onPressed={(e) => openPostDropdown(e, "user-menu")}
            />
            <IconButton icon="fa-solid fa-message" onPressed={() => {}} />
            <OutlineButton
              text={l10n.t(
                followingUsers[profileData.user_id] ? "unfollow" : "follow"
              )}
              color="gray"
              fontSize="base"
              radius={16}
              onPressed={() => {
                setFollowingUsers(
                  produce((state) => {
                    state[profileData.user_id] = !(
                      state[profileData.user_id] ?? false
                    );
                  })
                );

                if (followingUsers[profileData.user_id]) {
                  console.log(followingUsers[profileData.user_id]);
                  //TODO: fetch 팔로잉 취소
                } else {
                  console.log(followingUsers[profileData.user_id]);
                  //TODO: fetch 팔로잉 요청
                }
              }}
            />
          </div>
        )}
      </div>
      {/*이름, 뱃지, 아이디, Bio*/}
      <div className="flex flex-col gap-2">
        <span className="flex items-center gap-1">
          <p id="profile-name" className="text-xl font-semibold">
            {profileData.user_name}
          </p>
          <div id="profile-badge">
            {profileData.badge && <Badge {...profileData.badge} />}
          </div>
        </span>
        <p id="profile-bio" style={{ whiteSpace: "pre-wrap" }}>
          {profileData.bio}
        </p>
      </div>
      {/*팔로잉, 팔로워*/}
      <div className="flex gap-4">
        <TextButton
          text={`${profileData.following_count?.toLocaleString()} ${l10n.t(
            "following"
          )}`}
          fontSize="base"
          color="black"
          onPressed={() => {
            /*TODO: route to user following list*/
          }}
        />
        <TextButton
          text={`${profileData.follower_count?.toLocaleString()} ${l10n.t(
            "follower"
          )}`}
          fontSize="base"
          color="black"
          onPressed={() => {
            /*TODO: route to user follower list*/
          }}
        />
      </div>
    </div>
  );
}

/*-----------*/

function openPostDropdown(e, dropdownId) {
  const rect = e.currentTarget.getBoundingClientRect();
  const pos = {
    x: rect.right,
    y: rect.bottom,
  };

  const newDropdown = document.createElement("div");
  newDropdown.id = `${dropdownId}-box`;
  document.querySelector("body")!.appendChild(newDropdown);
  const root = ReactDOM.createRoot(newDropdown);
  root.render(
    <Dropdown
      id={dropdownId}
      position={pos}
      child={<div className="w-60 h-10 bg-transparent"></div>}
    />
  );
}

function openDialog(profileData: UserData, onChange: React.Dispatch<any>) {
  const newDialog = document.createElement("div");
  newDialog.id = `dialog-box`;
  document.querySelector("body")!.appendChild(newDialog);
  const root = ReactDOM.createRoot(newDialog);
  root.render(
    <Dialog child={<EditProfileItem {...profileData} onChange={onChange} />} />
  );
}

function viewImageFullScreen(url) {
  const newDialog = document.createElement("div");
  newDialog.id = "fullscreen-image-box";
  document.querySelector("body")!.appendChild(newDialog);
  const root = ReactDOM.createRoot(newDialog);
  root.render(<FullScreenImageViewer url={url} />);
}

export default ProfileBar;
