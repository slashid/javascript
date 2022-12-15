import { clsx } from "clsx";
import React from "react";
import * as styles from "./divider.css";

type Props = {
  children: React.ReactNode;
};

export const Divider: React.FC<Props> = ({ children }) => {
  return (
    <div className={clsx("sid-divider", styles.divider)}>
      <hr className={styles.hr} />
      <span className={styles.content}>{children}</span>
      <hr className={styles.hr} />
    </div>
  );
};
