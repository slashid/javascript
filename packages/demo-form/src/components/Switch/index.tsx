import React, { FC, useRef } from "react";
import css from "./switch.module.css";

interface Props {
  labelActive: string;
  labelNotActive: string;
  isActive: boolean;
  onChange?: (e: React.ChangeEvent<any>) => void;
  name: string;
}

const Switch: FC<Props> = ({
  labelActive,
  labelNotActive,
  isActive,
  onChange,
  name,
}) => {
  const checkboxRef = useRef<HTMLInputElement>(null);

  return (
    <div className={css.host}>
      <input
        ref={checkboxRef}
        type="checkbox"
        name={name}
        checked={isActive}
        onChange={onChange}
      ></input>

      <button
        type="button"
        className={`${css.container} ${isActive ? css.on : css.off}`}
        onClick={() => {
          checkboxRef.current?.click();
        }}
      >
        <div
          className={`${css.circle} ${isActive ? css.check : css.uncheck}`}
        ></div>
      </button>

      <span className={`${css.label} ${!isActive && css.disabled}`}>
        {isActive ? labelActive : labelNotActive}
      </span>
    </div>
  );
};

Switch.defaultProps = {};

export default Switch;
