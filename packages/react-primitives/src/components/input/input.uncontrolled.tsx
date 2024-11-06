import clsx from "clsx";

import type { BaseInputProps } from "./input.base";

import * as styles from "./input.css";

export type UncontrolledInputProps = Omit<
  BaseInputProps,
  "onChange" | "value"
> & { defaultValue: string; className?: string };

export const UncontrolledInput: React.FC<UncontrolledInputProps> = ({
  id,
  name,
  label,
  className,
  placeholder = "",
  autoComplete = "",
  type = "text",
  style,
  defaultValue,
}) => {
  return (
    <div
      className={clsx(
        "sid-input",
        `sid-input--${type}`,
        styles.host,
        className
      )}
    >
      <div className={styles.inputHost[type]}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        <input
          style={style}
          type={type}
          id={id}
          name={name}
          className={styles.input}
          placeholder={placeholder}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
        />
      </div>
    </div>
  );
};
