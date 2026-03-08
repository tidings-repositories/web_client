import { Dialog as RadixDialog } from "radix-ui";
import IconButton from "../button/IconButton";

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed top-0 right-0 bottom-0 left-0 bg-black/50 z-100 content-center">
          <RadixDialog.Content
            aria-describedby={undefined}
            className="bg-white max-w-132 flex flex-col py-4 mx-auto rounded-xl"
          >
            <div className="flex justify-between pt-4 pb-2 px-6">
              <div />
              <RadixDialog.Close asChild>
                <IconButton icon="xmark" size={24} onPressed={() => {}} />
              </RadixDialog.Close>
            </div>
            <div className="px-4">{children}</div>
          </RadixDialog.Content>
        </RadixDialog.Overlay>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

export default Dialog;
