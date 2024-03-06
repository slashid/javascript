import { clsx } from "clsx";
import { BaseInput, BaseInputProps } from "./input.base";

import * as styles from "./input.css";
import { otherPublicVariables, publicVariables } from "../../main";

export type InputProps = BaseInputProps & {
  type?: "text" | "email";
  error?: boolean;
  style?: Record<string, any>
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
  style
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
      style={{
        borderRadius: otherPublicVariables.inputBorderRadius,
        borderColor: otherPublicVariables.inputBorderColor
      }}
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
