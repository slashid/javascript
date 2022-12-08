import { clsx } from "clsx";
import { ChangeEvent, useCallback } from "react";
import { getList, findFlag } from "country-list-with-dial-code-and-flag";
import * as styles from "./input.css";
import { ChevronDown } from "../icon/chevron-down";

type BaseProps = {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  value: string;
  onChange: (value: string) => void;
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
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value: val } = e.target;
      onChange(val);
    },
    [onChange]
  );

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
          type={type}
          id={id}
          name={name}
          className={styles.input}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
        />
      </div>
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

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value: val } = e.target;
      onChange(val);
    },
    [onChange]
  );

  const handleChangeCountryCode = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const newCountryCode = e.target.value;
      onFlagChange(findFlag(newCountryCode)!);
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
          <select
            className={styles.select}
            value={flag.code}
            onChange={handleChangeCountryCode}
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name} {country.dial_code}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      <div className={styles.inputHost["tel"]}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        <input
          type={"tel"}
          id={id}
          name={name}
          className={styles.input}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};
