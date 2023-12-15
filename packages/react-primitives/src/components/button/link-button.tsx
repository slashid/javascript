import { ReactNode } from "react";
import { clsx } from "clsx";
import { ChevronLeft } from "../icon/chevron-left";
import * as styles from "./link-button.css";

type Props = {
  children: ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: "button" | "submit";
  variant?: styles.Variants;
  testId?: string;
};

export const LinkButton: React.FC<Props> = ({
  children,
  onClick,
  className,
  type = "button",
  variant = "base",
  testId,
}) => {
  return (
    <button
      data-testid={testId}
      type={type}
      className={clsx("sid-link-button", styles.variants[variant], className)}
      onClick={onClick}
    >
      {variant === "back" ? <ChevronLeft /> : null}
      {children}
    </button>
  );
};
