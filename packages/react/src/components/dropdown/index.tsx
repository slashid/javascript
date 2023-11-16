import * as Select from "@radix-ui/react-select";
import { clsx } from "clsx";
import { ReactNode, useCallback, useState } from "react";
import { Check, ChevronDown } from "@slashid/react-primitives";
import * as styles from "./dropdown.css";

type Item = {
  /** The value of the item. */
  value: string;
  /** The label of the item, used for display purposes only (the `.textContent` of the `<Select.ItemText>` part). */
  label: ReactNode;
  /**
   * Optional text used for typeahead purposes. By default the typeahead behavior will use the `label` prop.
   * Use this when the content is complex, or you have non-textual content inside.
   * For example, if you have an icon at the start of the item, you should pass the searchable text value here so that the typeahead behavior can match against it.
   */
  textValue?: string;
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
                  textValue={item.textValue}
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
