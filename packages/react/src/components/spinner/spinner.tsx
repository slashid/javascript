import clsx from "clsx";
import * as styles from "./spinner.css";

type Props = {
  className?: string;
  variant?: keyof typeof styles.spinnerVariants;
};

export const Spinner = ({ className, variant = "default" }: Props) => (
  <div className={clsx(styles.spinnerVariants[variant], className)} />
);
