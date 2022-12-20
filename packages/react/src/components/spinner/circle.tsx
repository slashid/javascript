import { clsx } from "clsx";
import * as styles from "./spinner.css";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export const Circle: React.FC<Props> = ({ children, className }) => (
  <div className={clsx(styles.background, className)}>{children}</div>
);
