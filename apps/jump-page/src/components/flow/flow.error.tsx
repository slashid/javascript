import { Circle, Exclamation, Stack } from "@slashid/react-primitives";
import { useAppContext } from "../app/app.context";
import { Text } from "../text";

import * as styles from "./flow.css";

export type ErrorType = "warning" | "error";

function ErrorIcon({ type }: { type: ErrorType }) {
  return (
    <Circle variant={type === "warning" ? "blue" : "red"} shouldAnimate={false}>
      <Exclamation />
    </Circle>
  );
}

export function Error({ type }: { type: ErrorType }) {
  const { logo } = useAppContext();

  return (
    <>
      <Stack space="2">
        <div className={styles.logo}>{logo}</div>
        <Stack space="0.25">
          <Text
            as="h1"
            variant={{ size: "2xl-title", weight: "bold" }}
            t="error.title"
          />
          <Text
            as="h2"
            t="error.detail"
            variant={{ color: "contrast", weight: "semibold" }}
          />
        </Stack>
      </Stack>
      <ErrorIcon type={type} />
      <Text
        className={styles.footer}
        t="footer.text"
        variant={{ size: "xs", weight: "semibold" }}
      />
    </>
  );
}
