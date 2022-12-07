import { clsx } from "clsx";
import { ChangeEventHandler } from "react";
import * as styles from "./input.css";

type Props = {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

export const Input: React.FC<Props> = ({
  name,
  id,
  label,
  placeholder = "",
  className = "",
  value,
  onChange,
}) => {
  return (
    <div className={clsx("sid-input", styles.host, className)}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        type="text"
        id={id}
        name={name}
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
