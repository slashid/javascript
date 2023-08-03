import { clsx } from "clsx";
import * as styles from "./style.css";
import * as RadixSwitch from "@radix-ui/react-switch";
import { Lock } from "../icon/lock";

type Props = RadixSwitch.SwitchProps & {
  blocked?: boolean;
};

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
