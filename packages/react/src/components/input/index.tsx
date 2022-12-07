import { clsx } from "clsx";
import { ChangeEventHandler, useState } from "react";
import {
  getList,
  findFlagByDialCode,
} from "country-list-with-dial-code-and-flag";
import * as styles from "./input.css";

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
  const [countryCode, setCountryCode] = useState("");
  const countries = getList();

  return (
    <div className={clsx("sid-input", styles.host, className)}>
      {type === "tel" ? (
        <div>
          Phone
          <div>
            <>{countryCode ? findFlagByDialCode(countryCode).flag : null}</>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
            >
              {countries.map((country) => (
                <option key={country.code} value={country.dial_code}>
                  {country.name} {country.dial_code}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}
      <div>
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
