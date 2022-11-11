import { Dispatch, FC, SetStateAction } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import css from "./phone-number-input.module.css";

interface Props {
  id?: string;
  isDisabled?: boolean;
  isSmall?: boolean;
  label?: string;
  onChange: Dispatch<SetStateAction<string>>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  placeholder: string;
  value: string;
}

const PhoneNumberInput: FC<Props> = ({
  isDisabled,
  isSmall,
  label,
  onChange,
  onBlur,
  placeholder,
  value,
}) => {
  return (
    <div
      className={`${css.host} ${isSmall ? css.small : ""} ${
        isDisabled ? css.disabled : ""
      }`}
    >
      {label && <p className={css.label}>{label}</p>}
      <PhoneInput
        autoFormat={false}
        buttonClass={css.dropdownButton}
        containerClass={css.container}
        country="us"
        dropdownClass={css.dropdown}
        inputClass={css.input}
        onChange={(value, data, _, formattedValue) => {
          onChange(formattedValue);
        }}
        onBlur={onBlur}
        placeholder={placeholder}
        value={value}
      />
    </div>
  );
};

export default PhoneNumberInput;
