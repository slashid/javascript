import clsx from "clsx";
import { Logo as TLogo } from "../../../context/config-context";
import * as styles from "./initial.css";
import { useConfiguration } from "../../../hooks/use-configuration";

export type Props = {
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

export const LogoSlot = ({
  children,
}: {
  children?: (props: Props) => React.ReactNode;
}) => {
  const { logo } = useConfiguration();

  if (typeof children !== "function") {
    return <Logo logo={logo} />;
  }

  return <>{children({ logo })}</>;
};

LogoSlot.displayName = "Logo";
