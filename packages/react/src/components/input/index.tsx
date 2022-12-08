import { clsx } from "clsx";
import { ChangeEventHandler, useState } from "react";
import { getList, findFlag } from "country-list-with-dial-code-and-flag";
import * as styles from "./input.css";
import { ChevronDown } from "../icon/chevron-down";

type Props = {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  type?: "text" | "email" | "tel";
};

export const Input: React.FC<Props> = ({
  name,
  id,
  label,
  placeholder = "",
  className = "",
  type = "text",
  value,
  onChange,
}) => {
  const [countryCode, setCountryCode] = useState("GB");
  const countries = getList();
  const selectedCountry = findFlag(countryCode);

  return (
    <div
      className={clsx(
        "sid-input",
        `sid-input--${type}`,
        styles.host,
        className
      )}
    >
      {type === "tel" && selectedCountry ? (
        <div className={styles.countryHost}>
          <div className={styles.countryCode}>
            <div>
              {selectedCountry.flag} {selectedCountry.dial_code}
            </div>
            <ChevronDown />
          </div>
          <select
            className={styles.select}
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name} {country.dial_code}
              </option>
            ))}
          </select>
        </div>
      ) : null}
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
          onChange={onChange}
        />
      </div>
    </div>
  );
};
