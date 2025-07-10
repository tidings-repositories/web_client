import { ChangeEvent, useEffect, useRef, useState } from "react";
import { BadgeProps, UserData } from "../../Types";
import Badge from "./Badge";
import OutlineButton from "../button/OutlineButton";
import * as l10n from "i18next";
import {
  requestGETWithToken,
  requestPATCHWithToken,
  requestPOSTWithToken,
} from "../../scripts/requestWithToken";
import axios, { AxiosResponse } from "axios";

type EditProfileItemProps = {
  user_id: string;
  user_name: string;
  bio: string;
  profile_image: string;
  profile_image_file?: File | null;
  badge: BadgeProps | null;
  onChange: React.Dispatch<any>;
};

function EditProfileItem({ ...origin }: EditProfileItemProps) {
  const [badgeList, setBadgeList] = useState([] as BadgeProps[]);
  const [profileData, setState] = useState(origin);
  const BIO_TEXTFIELD_ID = "bio-textfield";
  const MAX_LINE = 5;
  const EMOJI_REGEX = /[\p{Emoji_Presentation}\u200D\uFE0F]/gu;
  const changedPropsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const getBadgeAndUpdate = async () => {
      const OK = 200;
      const response = await requestGETWithToken(
        `${import.meta.env.VITE_API_URL}/profile/badge`
      );
      if (response.status == OK && response.data)
        setBadgeList(response.data.badgeList);
    };

    getBadgeAndUpdate();

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
              setState((state) => {
                return {
                  ...state,
                  user_name: input.target.value.trim().replace(EMOJI_REGEX, ""),
                };
              });
              changedPropsRef.current.add("user_name");
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
            setState((state) => {
              return {
                ...state,
                bio: editValue.target.value,
              };
            });
            changedPropsRef.current.add("bio");
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
            setState((state) => {
              return {
                ...state,
                badge: null,
              };
            });
            changedPropsRef.current.add("badge");
          }}
        >
          <div
            className="w-fit h-fit border border-3 rounded-md"
            style={{
              borderColor: !profileData.badge ? "gold" : "transparent",
            }}
          >
            <Badge id={-1} name="null" url="/none_badge.png" />
          </div>
        </button>
        {badgeList.map((thisBadge, idx) => (
          <button
            key={`${thisBadge.name}-${idx}`}
            className="!p-0"
            onClick={() => {
              setState((state) => {
                return {
                  ...state,
                  badge: thisBadge,
                };
              });
              changedPropsRef.current.add("badge");
            }}
          >
            <div
              className="w-fit h-fit border border-3 rounded-md"
              style={{
                borderColor:
                  profileData.badge?.id === thisBadge.id
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
          onPressed={() =>
            updateProfileData(profileData, changedPropsRef.current)
          }
        />
      </div>
      {/*file input tag*/}
      <input
        type="file"
        id="fileSearch"
        className="hidden"
        onChange={(e) =>
          changeProfileImage(e, setState, changedPropsRef.current)
        }
      />
    </div>
  );
}

/*-------------*/

async function updateProfileData(
  profileData: EditProfileItemProps,
  changedProps: Set<string>
) {
  if (changedProps.size != 0) {
    let imageUploadErrorFlag = false;
    //요청 만들기
    const profileUpdateRequestBody = {};
    //S3 Presigned 요청 및 업로드
    if (changedProps.has("profile_image_file")) {
      const OK = 200;
      const contentType = profileData["profile_image_file"]!.type;
      const response = (await requestPOSTWithToken(
        `${import.meta.env.VITE_API_URL}/storage/api/upload/profile`,
        {
          "content-type": contentType,
        }
      )) as AxiosResponse;

      if ((response.status = OK)) {
        const PRESIGNED_URL = response.data.presignedUrl;
        await axios
          .put(PRESIGNED_URL, profileData["profile_image_file"], {
            headers: { "Content-Type": contentType },
          })
          .catch((eR) => {
            imageUploadErrorFlag = true;
          });

        profileUpdateRequestBody["profile_image"] = PRESIGNED_URL;
        changedProps.delete("profile_image_file");
      } else {
        document
          .getElementById("dialog-background")
          ?.dispatchEvent(new Event("click", { bubbles: true }));
        return;
      }
    }

    if (imageUploadErrorFlag) {
      document
        .getElementById("dialog-background")
        ?.dispatchEvent(new Event("click", { bubbles: true }));
      return;
    }

    changedProps.forEach((propName) => {
      if (propName === "badge") {
        if (profileData[propName] == null)
          return (profileUpdateRequestBody[propName] = 0);
        else
          return (profileUpdateRequestBody[propName] =
            profileData[propName].id);
      }

      profileUpdateRequestBody[propName] = profileData[propName];
    });

    // 프로필 낙관적 업데이트
    profileData.onChange((state: UserData) => {
      return {
        ...state,
        user_name: profileData.user_name,
        bio: profileData.bio,
        profile_image: profileData.profile_image,
        badge: profileData.badge,
      };
    });

    requestPATCHWithToken(
      `${import.meta.env.VITE_API_URL}/profile`,
      profileUpdateRequestBody
    );
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
  stateDispatcher: React.Dispatch<React.SetStateAction<any>>,
  changedProps: Set<string>
) {
  const fileList = e.target.files ?? [];
  if (fileList.length != 0) {
    const newProfileImage = fileList[0];

    const [fileType, extType] = newProfileImage.type.split("/");
    if (fileType != "image" || extType == "gif") return;

    const tempUrl = URL.createObjectURL(newProfileImage);
    stateDispatcher((state: EditProfileItemProps) => {
      return {
        ...state,
        profile_image: tempUrl,
        profile_image_file: newProfileImage,
      };
    });
    changedProps.add("profile_image_file");
  }
}

export default EditProfileItem;
