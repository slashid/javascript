import clsx from "clsx";

import * as styles from "./card.css";

export type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div className={clsx("sid-card", styles.card, className)}>{children}</div>
  );
}
