import { Circle, Spinner, Stack } from "@slashid/react-primitives";
import { useAppContext } from "../app/app.context";
import { Text } from "../text";

import * as styles from "./flow.css";

function Loader() {
  return (
    <Circle>
      <Spinner />
    </Circle>
  );
}

export function InitialState() {
  const { logo } = useAppContext();

  return (
    <>
      <Stack space="2">
        <div className={styles.logo}>{logo}</div>
        <Stack space="0.25">
          <Text
            as="h1"
            variant={{ size: "2xl-title", weight: "bold" }}
            t="initial.title"
          />
          <Text
            variant={{ color: "contrast", weight: "semibold" }}
            as="h2"
            t="initial.details"
          />
        </Stack>
      </Stack>
      <Loader />
      <Text
        className={styles.footer}
        t="footer.text"
        variant={{ size: "xs", weight: "semibold" }}
      />
    </>
  );
}
