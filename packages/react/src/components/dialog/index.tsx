import * as RadixDialog from "@radix-ui/react-dialog";
import { clsx } from "clsx";
import { ReactNode, useState } from "react";
import { Theme, autoTheme, darkTheme, themeClass } from "../../theme/theme.css";
import { Close } from "../icon/close";
import * as styles from "./style.css";

type Props = {
  children: ReactNode;
  trigger: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
  theme?: Theme;
  modal?: boolean;
};

export const Dialog = ({
  children,
  trigger,
  open,
  onOpenChange,
  className,
  theme = "auto",
  modal = true,
}: Props) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  if (!trigger) return null;

  return (
    <div
      ref={setContainer}
      className={clsx(
        "sid-theme-root",
        `sid-theme-root__${theme}`,
        themeClass,
        { [darkTheme]: theme === "dark", [autoTheme]: theme === "auto" }
      )}
    >
      <RadixDialog.Root modal={modal} open={open} onOpenChange={onOpenChange}>
        <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>
        <RadixDialog.Portal container={container}>
          <RadixDialog.Overlay className={styles.overlay} />
          <RadixDialog.Content
            className={clsx("sid-dialog", styles.wrapper, className)}
          >
            <RadixDialog.Close asChild>
              <button className={styles.closeButton} aria-label="Close">
                <Close />
              </button>
            </RadixDialog.Close>
            {children}
          </RadixDialog.Content>
        </RadixDialog.Portal>
      </RadixDialog.Root>
    </div>
  );
};
