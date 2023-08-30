import * as Select from "@radix-ui/react-select";
import { clsx } from "clsx";
import { ReactNode, useCallback, useState } from "react";
import { Check } from "../icon/check";
import { ChevronDown } from "../icon/chevron-down";
import * as styles from "./dropdown.css";

type Item = {
  label: ReactNode;
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
  contentProps?: Select.SelectContentProps;
};

export const Dropdown: React.FC<Props> = ({
  label,
  placeholder,
  items,
  defaultValue,
  onChange,
  className,
  contentProps,
  disabled = false,
}) => {
  const [selected, onSelect] = useState<string | undefined>(defaultValue);
  const onSelectCallback = useCallback<Props["onChange"]>(
    (value) => {
      onSelect(value);
      onChange(value);
    },
    [onChange]
  );

  return (
    <div className="sid-dropdown">
      <Select.Root
        disabled={disabled}
        onValueChange={onSelectCallback}
        defaultValue={defaultValue}
      >
        <Select.Trigger
          className={clsx("sid-dropdown__trigger", styles.trigger, className)}
        >
          <label className={clsx("sid-dropdown__trigger__label", styles.label)}>
            {label}
          </label>
          <div
            className={clsx("sid-dropdown__trigger__input", styles.input)}
            placeholder={placeholder}
          >
            <Select.Value />
          </div>
          <ChevronDown
            className={clsx("sid-dropdown__trigger__icon", styles.icon)}
          />
        </Select.Trigger>

        <Select.Content
          {...contentProps}
          className={clsx(
            "sid-dropdown__popover",
            styles.content,
            contentProps?.className
          )}
        >
          <Select.Viewport
            className={clsx("sid-dropdown__viewport", styles.viewport)}
          >
            <Select.Group>
              {items.map((item) => (
                <Select.Item
                  className={clsx(
                    "sid-dropdown__item",
                    item.value === selected && "sid-dropdown__item--selected",
                    styles.item
                  )}
                  key={item.value}
                  value={item.value}
                >
                  <Select.ItemText>{item.label}</Select.ItemText>
                  <Select.ItemIndicator className={styles.selectedIcon}>
                    <Check className="sid-dropdown__item--selected__icon" />
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
