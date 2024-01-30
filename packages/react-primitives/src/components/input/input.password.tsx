import { clsx } from "clsx";
import { BaseInput, BaseInputProps } from "./input.base";

import * as styles from "./input.css";
import { useState } from "react";
import { Eye, EyeReveal } from "../icon";

export type PasswordInputProps = Omit<BaseInputProps, "type"> & {
  error?: boolean;
};

export const PasswordInput: React.FC<PasswordInputProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className={clsx(
        "sid-input",
        `sid-input--password`,
        styles.host,
        props.error && styles.error,
        props.className
      )}
    >
      <BaseInput {...props} type={showPassword ? "text" : "password"} />
      <button
        tabIndex={-1}
        className={styles.passwordRevealButton}
        type="button"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeReveal /> : <Eye />}
      </button>
    </div>
  );
};
