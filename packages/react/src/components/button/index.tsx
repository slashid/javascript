import { ReactNode } from "react";
import { clsx } from "clsx";
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
};

export const Button: React.FC<Props> = ({
  children,
  onClick,
  className,
  type = "button",
  variant = "primary",
  testId,
  icon,
  disabled,
}) => {
  return (
    <button
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
      {icon ? <i className={styles.icon}>{icon}</i> : null}
      {children}
    </button>
  );
};
