import { ChangeEventHandler, useCallback } from "react";

import * as styles from "./input.css";

export type BaseInputProps = {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  type?: "text" | "email" | "tel" | "password";
  value: string;
  rightSlot?: React.ReactNode;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

export const BaseInput: React.FC<BaseInputProps> = ({
  id,
  name,
  label,
  placeholder = "",
  value,
  onChange,
  type = "text",
  rightSlot,
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
        type={type}
        id={id}
        name={name}
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
      {rightSlot ? rightSlot : null}
    </div>
  );
};
