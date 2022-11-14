import { FC } from "react";

import css from "./input.module.css";

interface Props {
  id?: string;
  isDisabled?: boolean;
  isSmall?: boolean;
  label?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  placeholder: string;
  value: string | number;
  autoFocus?: boolean;
}

const Input: FC<Props> = ({
  id,
  isDisabled,
  isSmall,
  label,
  onChange,
  onBlur,
  placeholder,
  value,
  autoFocus,
}) => {
  return (
    <div
      className={`${css.host} ${isSmall ? css.small : ""} ${
        isDisabled ? css.disabled : ""
      }`}
    >
      {label && <p className={css.label}>{label}</p>}
      <input
        id={id}
        className={css.input}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        value={value}
        tabIndex={1}
        autoFocus={autoFocus}
      />
    </div>
  );
};

export default Input;
