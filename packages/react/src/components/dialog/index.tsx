import * as RadixDialog from "@radix-ui/react-dialog";
import { clsx } from "clsx";
import { ReactNode } from "react";
import { Close } from "../icon/close";
import * as styles from "./style.css";

type Props = {
  /** Dialog content */
  children: ReactNode;
  /** Dialog trigger */
  trigger: ReactNode;
  /** Dialog open state */
  open: boolean;
  /** Dialog open state change handler */
  onOpenChange: (open: boolean) => void;
  /** Dialog icon */
  icon?: ReactNode;
  /** Dialog custom portal container */
  container?: HTMLElement;
  /** Dialog content container class name */
  className?: string;
  /** When this boolean is set to `false`, the close button is hidden and dialog cannot be closed by clicking on the overlay */
  dismissable?: boolean;
  /**
   * The modality of the dialog.
   * When set to `true`, interaction with outside elements will be disabled and only dialog content will be visible to screen readers.
   * When set to `false`, interaction with outside elements will be enabled and all content will be visible to screen readers.
   */
  modal?: boolean;
};

/**
 * Dialog component built on top of Radix Dialog primitives.
 */
export const Dialog = ({
  children,
  trigger,
  open,
  onOpenChange,
  icon,
  className,
  // TODO: change default container to document.body once it has theme CSS variables
  container = document.querySelector<HTMLElement>(".sid-theme-root") ||
    document.body,
  dismissable = true,
  modal = true,
}: Props) => {
  if (!trigger) return null;

  return (
    <RadixDialog.Root modal={modal} open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>
      <RadixDialog.Portal container={container}>
        {modal && <RadixDialog.Overlay className={styles.overlay} />}
        <RadixDialog.Content
          className={clsx("sid-dialog", styles.wrapper, className)}
          onInteractOutside={(e) => {
            if (!dismissable) {
              e.preventDefault();
            }
          }}
        >
          <div className={styles.header}>
            <div>{icon}</div>
            {dismissable && (
              <RadixDialog.Close asChild>
                <button className={styles.closeButton} aria-label="Close">
                  <Close />
                </button>
              </RadixDialog.Close>
            )}
          </div>
          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};
