import { MessageProps } from "../../Types";
import FullScreenImageViewer from "../public/FullScreenImageViewer";
import ReactDOM from "react-dom/client";

function TheirMessage({ ...message }: MessageProps) {
  const messageSendAt = new Date(message.send_at);

  return (
    <div className="flex flex-col gap-1 justify-start items-start px-4">
      {/*message box*/}
      <div className="relative flex justify-start max-w-3/4">
        <div className="flex flex-col gap-2 p-2 rounded-lg bg-gray-300">
          {message.image && (
            <button
              className="!p-0"
              onClick={() => viewImageFullScreen(message.image)}
            >
              <img src={message.image} />
            </button>
          )}
          {message.text && (
            <p
              className="break-words text-start"
              style={{
                wordBreak: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "pre-wrap",
              }}
            >
              {message.text}
            </p>
          )}
        </div>
        {/*message box tail*/}
        <div
          className="absolute 
          -left-2 bottom-0 w-1 h-1 -z-1 
          border-20 border-transparent border-r-gray-300 
          border-l-0 border-b-0"
        />
      </div>
      {/*message create at*/}
      <p className="text-xs text-gray-500">
        {messageSendAt.toLocaleTimeString()}
      </p>
    </div>
  );
}

/*------------------*/
function viewImageFullScreen(url) {
  const newDialog = document.createElement("div");
  newDialog.id = "fullscreen-image-box";
  document.querySelector("body")!.appendChild(newDialog);
  const root = ReactDOM.createRoot(newDialog);
  root.render(<FullScreenImageViewer url={url} />);
}

export default TheirMessage;
