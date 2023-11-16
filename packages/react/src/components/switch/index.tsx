import { Lock } from "@slashid/react-primitives";
import * as RadixSwitch from "@radix-ui/react-switch";
import { clsx } from "clsx";

import * as styles from "./style.css";

type Props = RadixSwitch.SwitchProps & {
  /** blocked state where the switch is disabled and a lock icon is displayed */
  blocked?: boolean;
};

/**
 * Switch component built on top of Radix Switch primitives to display a toggle button.
 * It supports a blocked state where the switch is disabled and a lock icon is displayed.
 */
export const Switch = ({ className, blocked = false, ...props }: Props) => (
  <RadixSwitch.Root
    className={clsx("sid-switch", styles.radixSwitch, className)}
    data-blocked={blocked}
    disabled={blocked}
    {...props}
  >
    {blocked ? (
      <Lock className={styles.switchLock} />
    ) : (
      <RadixSwitch.Thumb className={styles.switchThumb} />
    )}
  </RadixSwitch.Root>
);
