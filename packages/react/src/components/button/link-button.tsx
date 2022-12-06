import { ReactNode } from "react";
import { clsx } from "clsx";
import * as styles from "./link-button.css";

type Props = {
  children: ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: "button" | "submit";
};

export const LinkButton: React.FC<Props> = ({
  children,
  onClick,
  className,
  type = "button",
}) => {
  return (
    <button
      type={type}
      className={clsx(
        "sid-link-button",
        styles.button,
        styles.color,
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
