import { useLayoutEffect, useCallback } from "react";
import { clsx } from "clsx";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
import { findFlag, getList } from "country-list-with-dial-code-and-flag";

import { ChevronDown } from "../icon";
import { BaseInput, BaseInputProps } from "./input.base";

import * as styles from "./input.css";

export type Flag = {
  name: string;
  dial_code: string;
  code: string;
  flag: string;
  preferred?: boolean;
};

type PhoneProps = BaseInputProps & {
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
  useLayoutEffect(() => {
    polyfillCountryFlagEmojis();
  }, []);

  const handleChangeCountryCode = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
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
            {getList().map((country) => (
              <option key={country.code} value={country.code}>
                {country.name} {country.dial_code}
              </option>
            ))}
          </select>
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
