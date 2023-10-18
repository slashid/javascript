import { Listbox as HeadlessListbox } from "@headlessui/react";
import { clsx } from "clsx";
import {
  Fragment,
  ReactNode,
  useCallback,
  useState
} from "react";
import { Check } from "../icon/check";
import { ChevronDown } from "../icon/chevron-down";
import * as styles from "./listbox.css";

type Item = {
  label: ReactNode;
  value: string;
  textValue?: string;
};

type Props = {
  className?: string;
  contentClassName?: string;
  items: Item[];
  defaultValue?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export const Listbox = ({
  items,
  defaultValue,
  onChange,
  className,
  contentClassName,
  disabled = false,
}: Props) => {
  const [value, setValue] = useState<string | undefined>(defaultValue);
  const onSelectCallback = useCallback<Props["onChange"]>(
    (value) => {
      setValue(value);
      onChange(value);
    },
    [onChange]
  );

  return (
    <div className="sid-listbox">
      <HeadlessListbox
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        onChange={onSelectCallback}
      >
        <HeadlessListbox.Button
          className={clsx("sid-listbox__button", styles.trigger, className)}
        >
          <ChevronDown
            className={clsx("sid-listbox__trigger__icon", styles.icon)}
          />
        </HeadlessListbox.Button>
        <div>
          <div
            className={clsx(
              "sid-listbox__popover",
              styles.content,
              contentClassName
            )}
          >
            <HeadlessListbox.Options>
              {items.map((item) => (
                <HeadlessListbox.Option
                  key={item.value}
                  value={item.value}
                  as={Fragment}
                >
                  {({ selected }) => (
                    <div
                      className={clsx(
                        "sid-listbox__item",
                        selected && "sid-listbox__item--selected",
                        styles.item
                      )}
                    >
                      <span>{item.label}</span>
                      {selected && (
                        <span className={styles.selectedIcon}>
                          <Check className="sid-listbox__item--selected__icon" />
                        </span>
                      )}
                    </div>
                  )}
                </HeadlessListbox.Option>
              ))}
            </HeadlessListbox.Options>
          </div>
        </div>
      </HeadlessListbox>
    </div>
  );
};
