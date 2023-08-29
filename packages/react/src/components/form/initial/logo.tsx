import clsx from "clsx";
import { Logo as TLogo } from "../../../context/config-context";
import * as styles from "./initial.css";

type Props = {
  logo?: TLogo;
};

export const Logo: React.FC<Props> = ({ logo }) => {
  if (typeof logo === "string") {
    return (
      <img
        className={clsx("sid-logo", "sid-logo--image", styles.logo)}
        src={logo}
        alt="Company logo"
      />
    );
  }

  return (
    <div className={clsx("sid-logo", "sid-logo--component", styles.logo)}>
      {logo}
    </div>
  );
};
