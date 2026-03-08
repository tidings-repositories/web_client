import { Dialog } from "radix-ui";
import IconButton from "../button/IconButton";

type FullScreenImageViewerProps = {
  url: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function FullScreenImageViewer({ url, open, onOpenChange }: FullScreenImageViewerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal={false}>
      <Dialog.Portal>
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed flex flex-col justify-between top-0 right-0 bottom-0 left-0 p-4 bg-black/50 z-100 content-center items-end"
          onClick={() => onOpenChange(false)}
        >
          <div className="flex justify-between pt-4 pb-2 px-6" onClick={(e) => e.stopPropagation()}>
            <div />
            <Dialog.Close asChild>
              <IconButton icon="xmark" size={24} color="white" onPressed={() => {}} />
            </Dialog.Close>
          </div>
          <img
            className="max-w-[90vw] max-h-[80vh] m-auto object-contain blur-none"
            style={{ objectFit: "contain" }}
            src={url}
            onClick={(e) => e.stopPropagation()}
          />
          <div />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default FullScreenImageViewer;
