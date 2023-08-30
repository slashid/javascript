import { clsx } from "clsx";
import { findFlag, getList } from "country-list-with-dial-code-and-flag";
import { ChangeEventHandler, useCallback } from "react";
import { Dropdown } from "../dropdown";
import { ChevronDown } from "../icon/chevron-down";
import * as styles from "./input.css";

type BaseProps = {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  type?: "text" | "email" | "tel";
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

const BaseInput: React.FC<BaseProps> = ({
  id,
  name,
  label,
  placeholder = "",
  value,
  onChange,
  type = "text",
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
    </div>
  );
};

type InputProps = BaseProps & {
  type?: "text" | "email";
};

export const Input: React.FC<InputProps> = ({
  name,
  id,
  label,
  placeholder = "",
  className = "",
  type = "text",
  value,
  onChange,
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
      <BaseInput
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

export type Flag = ReturnType<typeof getList>[0];
export const GB_FLAG: Flag = findFlag("GB")!;

type PhoneProps = BaseProps & {
  type?: "tel";
  flag: Flag;
  onFlagChange: (flag: Flag) => void;
};

export const PhoneInput: React.FC<PhoneProps> = ({
  name,
  id,
  label,
  placeholder = "",
  className = "",
  value,
  flag,
  onChange,
  onFlagChange,
}) => {
  const countries = getList();

  const handleChangeCountryCode = useCallback(
    (value: string) => {
      onFlagChange(findFlag(value)!);
    },
    [onFlagChange]
  );

  return (
    <div
      className={clsx("sid-input", `sid-input--tel`, styles.host, className)}
    >
      {flag ? (
        <div className={styles.countryHost}>
          <div className={styles.countryCode}>
            <div>
              {flag.flag} {flag.dial_code}
            </div>
            <ChevronDown />
          </div>
          <Dropdown
            defaultValue={flag.code}
            className={styles.dropdown}
            label=""
            onChange={handleChangeCountryCode}
            items={countries.map((country) => ({
              label: `${country.name} ${country.dial_code}`,
              value: country.code,
            }))}
          />
        </div>
      ) : null}
      <BaseInput
        id={id}
        name={name}
        label={label}
        placeholder={placeholder}
        className={className}
        type={"tel"}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
