import * as styles from "./input.css";

import type { BaseInputProps } from "./input.base";

export type UncontrolledInputProps = Omit<
  BaseInputProps,
  "onChange" | "value"
> & { defaultValue: string };

export const UncontrolledInput: React.FC<UncontrolledInputProps> = ({
  id,
  name,
  label,
  placeholder = "",
  autoComplete = "",
  type = "text",
  style,
  defaultValue,
}) => {
  return (
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
  );
};
