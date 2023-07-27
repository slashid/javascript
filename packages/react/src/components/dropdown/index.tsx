import * as Select from "@radix-ui/react-select";
import { clsx } from "clsx";
import { Check } from "../icon/check";
import { ChevronDown } from "../icon/chevron-down";
import * as styles from "./dropdown.css";

type Item = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  placeholder?: string;
  className?: string;
  type?: "text" | "email" | "tel";
  items: Item[];
  defaultValue?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export const Dropdown: React.FC<Props> = ({
  label,
  placeholder,
  items,
  defaultValue,
  onChange,
  className,
  disabled = false
}) => {
  return (
    <div className="sid-dropdown">
      <Select.Root disabled={disabled} onValueChange={onChange} defaultValue={defaultValue}>
        <Select.Trigger className={clsx(styles.trigger, className)}>
          <label className={styles.label}>{label}</label>
          <div className={styles.input} placeholder={placeholder}>
            <Select.Value />
            <ChevronDown className={styles.icon} />
          </div>
        </Select.Trigger>

        <Select.Content className={styles.content}>
          <Select.Viewport className={styles.viewport}>
            <Select.Group>
              {items.map((item) => (
                <Select.Item
                  className={styles.item}
                  key={item.label}
                  value={item.value}
                >
                  <Select.ItemText>{item.label}</Select.ItemText>
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
    </div>
  );
};
