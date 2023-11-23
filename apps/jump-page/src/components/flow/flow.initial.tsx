import { Skeleton, Stack } from "@slashid/react-primitives";
import { Text } from "../text";
import { Loader } from "./flow.loader";

import * as styles from "./flow.css";

export function Initial() {
  return (
    <>
      <Stack space="2">
        <div className={styles.logo}>
          <Skeleton width={24} height={24} />
        </div>
        <Stack space="0.75">
          <Skeleton width={"75%"} height={32} />
          <Skeleton width={"50%"} height={16} />
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
