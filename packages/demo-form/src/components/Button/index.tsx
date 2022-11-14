import React, { FC } from "react";
import Image from "next/image";

import Spinner, { SpinnerColorType } from "../Spinner";
import css from "./button.module.css";
import googleSrc from "./google.svg";

interface Props {
  id?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  isSecondary?: boolean;
  isSmall?: boolean;
  isGoogle?: boolean;
  label: string;
  onClick?: () => void;
  htmlType?: "button" | "submit" | "reset";
}

const Button: FC<Props> = ({
  id,
  isDisabled,
  isLoading,
  isSecondary,
  isSmall,
  isGoogle,
  label,
  htmlType = "button",
  onClick,
}) => {
  return (
    <button
      className={`${css.host} ${isSecondary ? css.secondary : ""} ${
        isLoading ? css.loading : ""
      } ${isSmall ? css.small : ""}`}
      disabled={isDisabled}
      id={id}
      onClick={onClick}
      tabIndex={1}
      type={htmlType}
    >
      <span
        className={`${isLoading ? css.invisible : ""} ${
          isGoogle ? css.google : ""
        }`}
      >
        {isGoogle ? (
          <div>
            <Image src={googleSrc} height={24} width={24} alt="google logo" />
          </div>
        ) : null}
        {label}
      </span>
      {isLoading && (
        <div className={css.spinnerWrapper}>
          <Spinner color={SpinnerColorType.Light} size={16} />
        </div>
      )}
    </button>
  );
};

export default Button;
