import * as RadixDialog from "@radix-ui/react-dialog";
import { clsx } from "clsx";
import { ReactNode, useState } from "react";
import { Close } from "../icon/close";
import * as styles from "./style.css";

type Props = {
  children: ReactNode;
  trigger: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icon?: ReactNode;
  className?: string;
  modal?: boolean;
};

export const Dialog = ({
  children,
  trigger,
  open,
  onOpenChange,
  icon,
  className,
  modal = true,
}: Props) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  if (!trigger) return null;

  return (
    <div ref={setContainer}>
      <RadixDialog.Root modal={modal} open={open} onOpenChange={onOpenChange}>
        <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>
        <RadixDialog.Portal container={container}>
          {modal && <RadixDialog.Overlay className={styles.overlay} />}
          <RadixDialog.Content
            className={clsx("sid-dialog", styles.wrapper, className)}
            onInteractOutside={(e) => {
              if (modal) {
                return;
              }
              e.preventDefault();
            }}
          >
            <div className={styles.header}>
              <div>{icon}</div>
              <RadixDialog.Close asChild>
                <button className={styles.closeButton} aria-label="Close">
                  <Close />
                </button>
              </RadixDialog.Close>
            </div>
            {children}
          </RadixDialog.Content>
        </RadixDialog.Portal>
      </RadixDialog.Root>
    </div>
  );
};
