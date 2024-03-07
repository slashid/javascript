import { ChangeEventHandler, useCallback } from "react";

import * as styles from "./input.css";

export type BaseInputProps = {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
  type?: "text" | "email" | "tel" | "password";
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  style?: React.CSSProperties;
};

export const BaseInput: React.FC<BaseInputProps> = ({
  id,
  name,
  label,
  placeholder = "",
  autoComplete = "",
  value,
  onChange,
  type = "text",
  style,
}) => {
  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      onChange(e);
    },
    [onChange]
  );

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
        value={value}
        onChange={handleChange}
        autoComplete={autoComplete}
      />
    </div>
  );
};
