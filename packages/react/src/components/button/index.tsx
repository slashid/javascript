import { clsx } from "clsx";
import { ReactNode, forwardRef } from "react";
import { Spinner } from "../spinner/spinner";
import * as styles from "./button.css";

type Props = {
  children: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: "button" | "submit";
  variant?: keyof typeof styles.button;
  icon?: ReactNode;
  testId?: string;
  disabled?: boolean;
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      children,
      onClick,
      className,
      type = "button",
      variant = "primary",
      testId,
      icon,
      disabled,
      loading = false,
    },
    forwardedRef
  ) => {
    return (
      <button
        ref={forwardedRef}
        data-testid={testId}
        type={type}
        disabled={disabled}
        className={clsx(
          "sid-button",
          `sid-button--${variant}`,
          styles.button[variant],
          { [styles.buttonDisabled]: disabled },
          className
        )}
        onClick={onClick}
      >
        {loading ? (
          <Spinner variant="short" className={styles.spinner[variant]} />
        ) : (
          <>
            {icon ? <i className={styles.icon}>{icon}</i> : null}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
