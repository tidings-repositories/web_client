import { useEffect, useState } from "react";
import { MessageUserSlotProps, UserData } from "../Types";
import AppBar from "../components/public/AppBar";
import Drawer from "../components/drawer/Drawer";
import MessageAppBarItem from "../components/message/MessageAppBarItem";
import RouterDrawerItem from "../components/drawer/RouterDrawerItem";
import MessageList from "../components/message/MessageList";
import DirectMessage from "../components/message/DirectMessage";

import { createMockDM } from "../../dev/mockdata";
import useUserDataStore from "../store/UserDataStore";

export default function Message() {
  const userInfo = useUserDataStore((state) => ({
    user_id: state.user_id,
    user_name: state.user_name,
    profile_image: state.profile_image,
    badge: state.badge,
  })) as UserData;
  const [messageList, setMessageList] = useState([] as MessageUserSlotProps[]);
  const [selectedIdx, setSelectedDM] = useState(null as number | null);

  const wideViewStandard = 1000;
  const checkWideView = () => window.innerWidth > wideViewStandard;
  const viewName = window.location.pathname.split("/").pop();

  useEffect(() => {
    //접근한 viewName에 따라서 userInfo로 해당 정보 받아오기
    // - dm list or dm messages 만약 dm message라면  dm list 중에 있는지 확인하고 setSelectedDM

    //TODO: fetch direct messages
    setMessageList(Array.from({ length: 2 }, () => createMockDM()));
  }, []);

  return (
    <div id="scaffold" className="w-screen h-screen mx-auto content-start">
      <AppBar child={<MessageAppBarItem />} />
      <Drawer child={<RouterDrawerItem />} />
      {(checkWideView() && (
        <div
          id="message"
          className="flex h-full justify-center px-4 pt-20 divide-x-2 divide-solid divide-gray-300"
        >
          <MessageList
            directMessages={messageList}
            selectedIdx={selectedIdx}
            stateDispatcher={setSelectedDM}
          />
          <DirectMessage
            directMessageInfo={
              selectedIdx != null ? messageList[selectedIdx] : null
            }
            stateDispatcher={setSelectedDM}
          />
        </div>
      )) || (
        <div id="message" className="flex h-full justify-center px-4 pt-20">
          {viewName == "message" ? (
            <MessageList
              directMessages={messageList}
              selectedIdx={selectedIdx}
              stateDispatcher={setSelectedDM}
            />
          ) : (
            <DirectMessage
              directMessageInfo={
                selectedIdx != null ? messageList[selectedIdx] : null
              }
              stateDispatcher={setSelectedDM}
            />
          )}
        </div>
      )}
    </div>
  );
}
