import { clsx } from "clsx";
import * as styles from "./spinner.css";
import { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
};

export const Circle: React.FC<Props> = ({ children, className }) => (
  <div className={clsx(styles.background, className)}>{children}</div>
);
