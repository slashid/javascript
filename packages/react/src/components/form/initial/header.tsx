import React from "react";
import { useConfiguration } from "../../../hooks/use-configuration";
import { TextConfig } from "../../text/constants";
import { Text } from "../../text";

import * as styles from "./initial.css";

type Props = {
  text: TextConfig;
};
export const HeaderSlot = ({
  children,
}: {
  children?: React.ReactNode | ((props: Props) => React.ReactNode);
}) => {
  const { text } = useConfiguration();

  const Heading = React.useMemo(() => {
    return (
      <div className={styles.header}>
        <Text
          as="h1"
          variant={{ size: "2xl-title", weight: "bold" }}
          t="initial.title"
        />
        <Text variant={{ color: "tertiary" }} as="h2" t="initial.subtitle" />
      </div>
    );
  }, []);

  if (typeof children === "function") {
    return <>{children({ text })}</>;
  }

  if (React.Children.count(children) > 0) {
    return <>{children}</>;
  }

  return Heading;
};

HeaderSlot.displayName = "Header";
