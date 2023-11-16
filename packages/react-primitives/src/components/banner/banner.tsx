import { clsx } from "clsx";
import * as styles from "./banner.css";
import { Failure } from "../icon/failure";
import { Text } from "../text";
import { Check } from "../icon/check";
import { TextConfigKey } from "../text/types";
import { Stack } from "../stack";

type Props = {
  variant: "success" | "failure";
  title: TextConfigKey;
  description?: TextConfigKey;
};

export const Banner = (props: Props) => {
  const icon = (() => {
    switch (props.variant) {
      case "success":
        return <Check />;
      case "failure":
        return <Failure />;
    }
  })();

  return (
    <Stack
      variant={{ direction: "horizontal" }}
      className={clsx(
        "sid-banner",
        `sid-banner--${props.variant}`,
        styles.banner[props.variant]
      )}
    >
      {icon}
      <Stack>
        <Text
          variant={{ weight: "bold", color: props.variant, size: "xl" }}
          t={props.title}
        />
        {props.description && (
          <Text
            className={clsx(styles.description)}
            t={props.description}
            variant={{ size: "xs" }}
          />
        )}
      </Stack>
    </Stack>
  );
};
