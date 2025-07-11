import { useEffect, useState } from "react";
import { MessageUserSlotProps, UserData } from "../Types";
import AppBar from "../components/public/AppBar";
import Drawer from "../components/drawer/Drawer";
import RouterDrawerItem from "../components/drawer/RouterDrawerItem";
import MessageList from "../components/message/MessageList";
import DirectMessage from "../components/message/DirectMessage";

// import { createMockDM } from "../../dev/mockdata";
import useUserDataStore from "../store/UserDataStore";
import { useNavigate } from "react-router-dom";

export default function Message() {
  const userId = useUserDataStore((state) => state.user_id);
  const [messageList, setMessageList] = useState([] as MessageUserSlotProps[]);
  const [selectedIdx, setSelectedDM] = useState(null as number | null);

  const navigator = useNavigate();
  const wideViewStandard = 1000;
  const checkWideView = () => window.innerWidth > wideViewStandard;
  const viewName = window.location.pathname.split("/").pop();

  useEffect(() => {
    if (userId == null) navigator("/");
    //접근한 viewName에 따라서 토큰으로 해당 정보 받아오기
    // - dm list or dm messages 만약 dm message라면  dm list 중에 있는지 확인하고 setSelectedDM

    //TODO: fetch direct messages
    // setMessageList(Array.from({ length: 2 }, () => createMockDM()));
  }, []);

  return (
    <div id="scaffold" className="w-screen h-screen mx-auto content-start">
      <AppBar showSearch={false} showMessage={false} showLogin={false} />
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
