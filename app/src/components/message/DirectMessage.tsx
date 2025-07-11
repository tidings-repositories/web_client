import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MessageProps, MessageUserSlotProps } from "../../Types";
import SimpleUserSlot from "../public/SimpleUserSlot";
import IconButton from "../button/IconButton";
import MyMessage from "./MyMessage";
import TheirMessage from "./TheirMessage";
// import { createMockMessage } from "../../../dev/mockdata";
import { produce } from "immer";
import useUserDataStore from "../../store/UserDataStore";

type DirectMessageProps = {
  directMessageInfo: MessageUserSlotProps | null;
  stateDispatcher: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function DirectMessage({
  directMessageInfo,
  stateDispatcher,
}: DirectMessageProps) {
  const userId = useUserDataStore((state) => state.user_id);
  const navigator = useNavigate();
  const [messages, setMessages] = useState([] as MessageProps[]);
  const [inputImage, setInputImage] = useState(null as string | null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    //TODO: fetch dm message list with directMessageInfo
    // setMessages(Array.from({ length: 10 }, () => createMockMessage()));

    //TODO: reverse infiniteScroll fetch and redering

    //textfield resize event
    const eventHandler = () => {
      textfieldResizeEvent(textElement);
    };
    const textElement = document.getElementById(
      "dm-textarea"
    )! as HTMLTextAreaElement;
    if (directMessageInfo) textElement.addEventListener("input", eventHandler);

    //message container scroll initialze
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) toBottomScroll(messageContainer);

    //cleanup
    return () => {
      if (directMessageInfo)
        textElement.removeEventListener("input", eventHandler);
    };
  }, [directMessageInfo]);

  useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      const imgs = messageContainer.querySelectorAll("img");
      let loadedCount = 0;

      const tryScroll = () => {
        if (++loadedCount === imgs.length) {
          messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      };

      imgs.forEach((img) => {
        if (img.complete) tryScroll();
        else img.onload = tryScroll;
      });

      if (imgs.length === 0) {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages]);

  return (
    <>
      <div
        id="direct-message"
        className="sticky top-20 min-w-120 w-full max-w-full flex flex-col justify-between"
        style={{ maxHeight: "calc(100vh - 6rem)" }}
      >
        {/*utility bar*/}
        {directMessageInfo && (
          <div
            id="dm-utility"
            className="flex gap-2 p-2 border-b-2 border-gray-300 justify-start"
          >
            <IconButton
              icon="fa-solid fa-chevron-left"
              onPressed={() => {
                stateDispatcher(null);
                navigator("/message", { replace: true });
              }}
            />
            {/*DM userInfo*/}
            <div className="w-fit">
              <SimpleUserSlot {...directMessageInfo.userInfo} />
            </div>
          </div>
        )}
        {/*message component area*/}
        {directMessageInfo && (
          <div
            id="message-container"
            className="w-full h-full flex flex-col gap-1 px-1 py-4 overflow-y-auto"
          >
            {messages.map((message) => {
              return message.user_id == userId ? (
                <MyMessage key={message.message_id} {...message} />
              ) : (
                <TheirMessage key={message.message_id} {...message} />
              );
            })}
            <div ref={messageEndRef}></div>
          </div>
        )}
        {/*input field*/}
        <div className="flex px-2 mt-1">
          {directMessageInfo && (
            <div className="flex w-full px-4 py-1 gap-2 bg-gray-200 rounded-xl">
              <IconButton
                icon="fa-solid fa-image"
                onPressed={() => document.getElementById("fileSearch")!.click()}
              />
              <input
                type="file"
                id="fileSearch"
                className="hidden"
                onChange={(e) => {
                  const newFile = e.target.files ?? [];
                  if (newFile.length != 0) {
                    const selectedFile = newFile[0];
                    const fileType = selectedFile.type.split("/")[0];
                    if (fileType != "image") return;

                    const imageUrl = URL.createObjectURL(selectedFile);
                    setInputImage(imageUrl);
                  }
                }}
              />
              <div className="w-full flex flex-col">
                {/*input image area*/}
                {inputImage && (
                  <div className="relative w-fit max-w-full max-h-37.5 rounded-xl overflow-hidden">
                    <div className="absolute right-0">
                      <IconButton
                        icon="fa-solid fa-xmark-circle"
                        color="black"
                        onPressed={() => {
                          (document.getElementById(
                            "fileSearch"
                          ) as HTMLInputElement)!.value = "";
                          setInputImage(null);
                        }}
                      />
                    </div>
                    <img
                      className="w-fit max-w-full max-h-37.5"
                      src={inputImage}
                      style={{ objectFit: "fill" }}
                    />
                  </div>
                )}
                {/*message textarea*/}
                <form
                  className="w-full"
                  onSubmit={(e) => {
                    e.preventDefault();
                    //text content
                    const formData = new FormData(e.currentTarget);
                    const detail =
                      (formData.get("dm-textinput") as string) ?? "";
                    const text =
                      detail.trim() != "" ? detail.trim() : undefined;
                    e.currentTarget.reset();

                    const fileInputHideComponent = document.getElementById(
                      "fileSearch"
                    )! as HTMLInputElement;
                    const files = fileInputHideComponent.files ?? [];
                    let image: null | File = null;
                    if (files.length != 0) {
                      image = files[0];
                      fileInputHideComponent.value = "";
                      setInputImage(null);
                    }

                    //textarea 사이즈 조절용 이벤트 발생
                    const textElement =
                      e.currentTarget.querySelector("textarea");
                    textElement!.dispatchEvent(new Event("input"));

                    //TODO: 낙관적 업데이트
                    console.log("text: ", detail); //TODO: send text
                    console.log("file: ", image);
                    setMessages((prevMessages) =>
                      produce(prevMessages, (state) => {
                        state.push({
                          create_at: new Date(Date.now()),
                          dm_id: directMessageInfo.dm_id,
                          message_id: (125125124124 * Math.random()).toString(),
                          user_id: userId,
                          text: text,
                          media: image ? URL.createObjectURL(image) : null,
                        } as MessageProps);
                      })
                    );
                  }}
                >
                  <textarea
                    id="dm-textarea"
                    className="w-full content-center"
                    name="dm-textinput"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        e.currentTarget.form?.requestSubmit();
                      }
                    }}
                  />
                </form>
              </div>
              <IconButton
                icon="fa-solid fa-paper-plane"
                onPressed={() => {
                  document.querySelector("form")?.requestSubmit();
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function textfieldResizeEvent(textarea: HTMLElement) {
  if (textarea.scrollHeight >= window.innerHeight / 5) {
    textarea.style.overflow = "auto";
  } else {
    textarea.style.overflow = "none";
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }
}

function toBottomScroll(container) {
  const scrollToBottom = () => {
    container.scrollTo({ top: container.scrollHeight, behavior: "auto" });
  };

  const imgs = container.querySelectorAll("img");
  let loadedCount = 0;

  if (imgs.length === 0) {
    requestAnimationFrame(scrollToBottom);
    return;
  }

  imgs.forEach((img) => {
    if (img.complete) {
      loadedCount++;
    } else {
      img.onload = () => {
        loadedCount++;
        if (loadedCount === imgs.length) scrollToBottom();
      };
    }
  });

  if (loadedCount === imgs.length) {
    requestAnimationFrame(scrollToBottom);
  }
}
