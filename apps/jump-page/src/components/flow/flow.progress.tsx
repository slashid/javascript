import { Stack } from "@slashid/react-primitives";
import { Loader } from "./flow.loader";
import { useAppContext } from "../app/app.context";
import { Text } from "../text";

import * as styles from "./flow.css";

export function Progress() {
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
