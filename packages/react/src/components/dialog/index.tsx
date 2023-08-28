import * as RadixDialog from "@radix-ui/react-dialog";
import { clsx } from "clsx";
import { ReactNode, useMemo } from "react";
import { Close } from "../icon/close";
import * as styles from "./style.css";

export type DialogProps = {
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
  container?: HTMLElement | (() => HTMLElement | null) | null;
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
  container,
  dismissable = true,
  modal = true,
}: DialogProps) => {
  /**
   * Check if the container function return value changed every cycle but only
   * trigger another render when it actually changes.
   */
  const containerFuncReturn = (() => {
    if (typeof container !== "function") return null

    return container()
  })()

  const __container = useMemo(() => {
    if (typeof container === "function") return containerFuncReturn
    return container
  }, [container, containerFuncReturn])

  if (!trigger) return null;

  return (
    <RadixDialog.Root modal={modal} open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>
      <RadixDialog.Portal container={__container}>
        {modal && <RadixDialog.Overlay className={styles.overlay} />}
        <RadixDialog.Content
          className={clsx("sid-dialog", styles.wrapper, className)}
          onInteractOutside={(e) => {
            if (!modal || !dismissable) {
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
