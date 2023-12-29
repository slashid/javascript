import React, { FC } from "react";

import css from "./toast.module.css";

interface Props {
  message: string;
}

const Toast: FC<Props> = ({ message }) => (
  <div className={css.host}>
    <span className={css.message}>{message}</span>
  </div>
);

export default Toast;
