import * as Select from "@radix-ui/react-select";
import { Check } from "../icon/check";
import * as styles from "./dropdown.css";

type Props = {
  label: string;
  placeholder?: string;
  className?: string;
  type?: "text" | "email" | "tel";
};

export const Dropdown: React.FC<Props> = ({ label, placeholder }) => {
  const items = ["apple", "banana", "grapes"];

  return (
    <Select.Root>
      <Select.Trigger className={styles.trigger}>
        <label className={styles.label}>{label}</label>
        <div className={styles.input} placeholder={placeholder}>
          <Select.Value />
        </div>
      </Select.Trigger>

      <Select.Content className={styles.content}>
        <Select.Viewport className={styles.viewport}>
          <Select.Group>
            {items.map((f) => (
              <Select.Item className={styles.item} key={f} value={f}>
                <Select.ItemText>{f}</Select.ItemText>
                <Select.ItemIndicator>
                  <Check />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Viewport>
        <Select.ScrollDownButton />
      </Select.Content>
    </Select.Root>
  );
};
