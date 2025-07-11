import { useEffect, useState } from "react";
import { DropwdownSlot } from "../public/Dropdown";
import { NotificationData } from "../../Types";
import * as l10n from "i18next";

// import { createMockNotification } from "../../../dev/mockdata"; //TODO: remove

type NotificationDropdownItemProps = {
  user_id: string;
};

function NotificationDropdownItem({ user_id }: NotificationDropdownItemProps) {
  const [notificationList, setState] = useState([] as NotificationData[]);

  useEffect(() => {
    // setState(
    //   Array.from({ length: 10 }).map(() =>
    //     createMockNotification()
    //   ) as NotificationData[]
    // ); //fetch notification user_id
  }, []);

  return (
    <div className="w-60 max-h-100 flex flex-col gap-1 z-51 overflow-y-auto">
      {notificationList.map((notification, idx) => (
        <DropwdownSlot
          key={idx}
          text=""
          extraAfterNode={
            <div className="flex flex-col">
              <p className="text-sm" style={{ whiteSpace: "pre-wrap" }}>{`@${
                notification.published_by
              }${l10n.t("by")} ${parseTypeToEventMessage(
                notification.type
              )}`}</p>
              <p className="text-xs text-gray-500">
                {notification.published_at.toLocaleString()}
              </p>
            </div>
          }
          behavior={() =>
            notificationTypeEvent(notification.type, notification.detail)
          }
        />
      ))}
      {/*Empty notification*/}
      {notificationList.length == 0 && (
        <div className="h-30 content-center">
          <p className="text-center">{l10n.t("emptyNotification")}</p>
        </div>
      )}
    </div>
  );
}

function parseTypeToEventMessage(type) {
  switch (type) {
    case "comment":
      return l10n.t("leftComment");
    case "scrap":
      return l10n.t("scrapPost");
    case "like":
      return l10n.t("likePost");
    case "follow":
      return l10n.t("followYou");
  }
}

function notificationTypeEvent(type, detail) {
  //TODO: route to notification type Event with detail
  console.log(type, detail);
  switch (type) {
    case "comment":
      //route to post
      break;
    case "scrap":
      //route to scrap post
      break;
    case "like":
      //route to post
      break;
    case "follow":
      //route to my profile
      break;
  }
}

export default NotificationDropdownItem;
