import { clsx } from "clsx";
import { BaseInput, BaseInputProps } from "./input.base";

import * as styles from "./input.css";

export type InputProps = BaseInputProps & {
  type?: "text" | "email";
  error?: boolean;
  style?: React.CSSProperties;
};

export const Input: React.FC<InputProps> = ({
  name,
  id,
  label,
  placeholder = "",
  className = "",
  type = "text",
  value,
  error,
  onChange,
  style,
}) => {
  return (
    <div
      className={clsx(
        "sid-input",
        `sid-input--${type}`,
        styles.host,
        error && styles.error,
        className
      )}
    >
      <BaseInput
        style={style}
        id={id}
        name={name}
        label={label}
        placeholder={placeholder}
        className={className}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
