import * as RadixDialog from "@radix-ui/react-dialog";
import { clsx } from "clsx";
import { ReactNode, useState } from "react";
import { ThemeRoot } from "../../theme/theme-root";
import { Theme } from "../../theme/theme.css";
import { Close } from "../icon/close";
import * as styles from "./style.css";

type Props = {
  children: ReactNode;
  trigger: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icon?: ReactNode;
  className?: string;
  theme?: Theme;
  modal?: boolean;
};

export const Dialog = ({
  children,
  trigger,
  open,
  onOpenChange,
  icon,
  className,
  theme = "light",
  modal = true,
}: Props) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  if (!trigger) return null;

  return (
    <ThemeRoot theme={theme}>
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
    </ThemeRoot>
  );
};
