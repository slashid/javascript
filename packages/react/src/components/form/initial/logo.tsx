import clsx from "clsx";
import { SlashID } from "@slashid/react-primitives";
import { Logo as TLogo } from "../../../context/config-context";
import { useConfiguration } from "../../../hooks/use-configuration";

import * as styles from "./initial.css";

export type Props = {
  logo?: TLogo;
};

export const Logo: React.FC<Props> = ({ logo }) => {
  if (typeof logo === "string" && logo) {
    return (
      <div className={clsx("sid-logo", "sid-logo--image", styles.logo)}>
        <div>
          <img className={styles.logo} src={logo} alt="Company logo" />
        </div>
      </div>
    );
  }

  const logoComponent = logo ? logo : <SlashID />;

  if (!logo) {
    console.info("SlashID: No logo provided. Using default logo.");
  }

  return (
    <div className={clsx("sid-logo", "sid-logo--component", styles.logo)}>
      {logoComponent}
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
