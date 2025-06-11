import { ChangeEvent, useEffect, useState } from "react";
import { BadgeProps, UserData } from "../../Types";
import Badge from "./Badge";
import OutlineButton from "../button/OutlineButton";
import * as l10n from "i18next";

type EditProfileItem = {
  user_id: string;
  user_name: string;
  bio: string;
  profile_image: string;
  profile_image_file?: File | null;
  badge: BadgeProps | null;
  onChange: React.Dispatch<any>;
};

let isChange = false;

function EditProfileItem({ ...origin }: EditProfileItem) {
  const [badgeList, setBadgeList] = useState([] as BadgeProps[]);
  const [profileData, setState] = useState(origin);
  const BIO_TEXTFIELD_ID = "bio-textfield";
  const MAX_LINE = 5;
  const EMOJI_REGEX = /[\p{Emoji_Presentation}\u200D\uFE0F]/gu;

  useEffect(() => {
    isChange = false;

    const mockBadgeData = {
      name: "마비노기 모바일 오픈 뱃지",
      url: "/dev/mabinogi_badge.png",
    }; //mockData
    setBadgeList([mockBadgeData]); //TODO: fetch user_id 보유 badge 리스트

    const textElement = document.getElementById(
      BIO_TEXTFIELD_ID
    )! as HTMLTextAreaElement;

    const eventHandler = () => {
      checkTextfieldMaxLine(textElement, MAX_LINE);
    };
    textElement.addEventListener("input", eventHandler);
    return () => textElement.removeEventListener("input", eventHandler);
  }, []);

  return (
    <div className="flex flex-col gap-10 pb-10">
      <div className="flex justify-between items-end">
        {/*Edit profile image*/}
        <button
          className="!relative !p-0 !mx-2"
          onClick={() => document.getElementById("fileSearch")!.click()}
        >
          {/*cover*/}
          <div className="absolute w-full h-full bg-black opacity-10 rounded-4xl content-center">
            <p className="text-white text-center">
              {l10n.t("editProfileImage")}
            </p>
          </div>
          {/*profile image*/}
          <img
            className="w-40 h-40 rounded-4xl"
            style={{ objectFit: "cover" }}
            src={profileData.profile_image}
          />
        </button>
        {/*Edit name*/}
        <div className="relative h-14 x-full border p-3 content-center rounded-lg">
          <p className="absolute -top-3 bg-white px-2 text-sm">
            {l10n.t("name")}
          </p>
          <input
            className="h-full text-lg"
            type="text"
            maxLength={12}
            defaultValue={profileData.user_name}
            onChange={(input) => {
              isChange = true;
              setState((state) => {
                return {
                  ...state,
                  user_name: input.target.value.trim().replace(EMOJI_REGEX, ""),
                };
              });
            }}
          />
        </div>
      </div>
      {/*Edit Bio*/}
      <div className="relative h-28 x-full border p-3 content-center rounded-lg">
        <p className="absolute -top-3 bg-white px-2 text-sm">{l10n.t("bio")}</p>
        <textarea
          id={BIO_TEXTFIELD_ID}
          rows={MAX_LINE}
          maxLength={100}
          className="h-full w-full px-2 text-lg !overflow-y-auto"
          defaultValue={profileData.bio}
          onChange={(editValue) => {
            isChange = true;
            setState((state) => {
              return {
                ...state,
                bio: editValue.target.value,
              };
            });
          }}
        />
      </div>
      {/*보유 뱃지 리스트*/}
      <div className="relative h-14 x-full flex gap-4 border p-3 items-center content-center rounded-lg">
        <p className="absolute -top-3 bg-white px-2 text-sm">
          {l10n.t("badge")}
        </p>
        <button
          className="!p-0"
          onClick={() => {
            isChange = true;
            setState((state) => {
              return {
                ...state,
                badge: null,
              };
            });
          }}
        >
          <div
            className="w-fit h-fit border border-3 rounded-md"
            style={{
              borderColor: !profileData.badge ? "gold" : "transparent",
            }}
          >
            <Badge name="null" url="/none_badge.png" />
          </div>
        </button>
        {badgeList.map((thisBadge, idx) => (
          <button
            key={`${thisBadge.name}-${idx}`}
            className="!p-0"
            onClick={() => {
              isChange = true;
              setState((state) => {
                return {
                  ...state,
                  badge: thisBadge,
                };
              });
            }}
          >
            <div
              className="w-fit h-fit border border-3 rounded-md"
              style={{
                borderColor:
                  profileData.badge?.name === thisBadge.name
                    ? "gold"
                    : "transparent",
              }}
            >
              <Badge {...thisBadge} />
            </div>
          </button>
        ))}
      </div>
      {/*저장 및 업데이트 버튼*/}
      <div className="self-end">
        <OutlineButton
          color="gray"
          radius={16}
          text="프로필 저장"
          fontSize="lg"
          backgroundColor="gray"
          fontColor="white"
          onPressed={() => updateProfileData(profileData)}
        />
      </div>
      {/*file input tag*/}
      <input
        type="file"
        id="fileSearch"
        className="hidden"
        onChange={(e) => changeProfileImage(e, setState)}
      />
    </div>
  );
}

/*-------------*/

function updateProfileData(profileData: EditProfileItem) {
  if (isChange) {
    //프로필 낙관적 업데이트
    profileData.onChange((state: UserData) => {
      return {
        ...state,
        user_name: profileData.user_name,
        bio: profileData.bio,
        profile_image: profileData.profile_image,
        badge: profileData.badge,
      };
    });

    //fetch //TODO: 유저 데이터베이스 PUT 업데이트
  }

  document
    .getElementById("dialog-background")
    ?.dispatchEvent(new Event("click", { bubbles: true }));
}

function checkTextfieldMaxLine(
  textarea: HTMLTextAreaElement,
  MAX_LINE_COUNT: number
) {
  const line = textarea.value.split("\n");
  if (line.length > MAX_LINE_COUNT) {
    line[MAX_LINE_COUNT - 1] = `${line[MAX_LINE_COUNT - 1]}${
      line[MAX_LINE_COUNT]
    }`;
    textarea.value = line.slice(0, MAX_LINE_COUNT).join("\n");
  }
}

function changeProfileImage(
  e: ChangeEvent<HTMLInputElement>,
  stateDispatcher: React.Dispatch<React.SetStateAction<any>>
) {
  const fileList = e.target.files ?? [];
  if (fileList.length != 0) {
    isChange = true;
    const newProfileImage = fileList[0];

    const fileType = newProfileImage.type.split("/")[0];
    if (fileType != "image") return;

    const tempUrl = URL.createObjectURL(newProfileImage);
    stateDispatcher((state: EditProfileItem) => {
      return {
        ...state,
        profile_image: tempUrl,
        profile_image_file: newProfileImage,
      };
    });
  }
}

export default EditProfileItem;
