import { Listbox as HeadlessListbox } from "@headlessui/react";
import { clsx } from "clsx";
import {
  Fragment,
  ReactNode,
  memo,
  useCallback,
  useRef,
  useState,
} from "react";
import {   areEqual } from "react-window";
// import { FixedSizeList as List, areEqual } from "react-window";
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

type OptionProps = {
  data: { items: Item[] };
  index: number;
  style: React.CSSProperties;
};

const Option = memo(({ data, index, style }: OptionProps) => {
  const { items } = data;
  const item = items[index];
  console.log("render option", item);

  return (
    <div style={style}>
      <HeadlessListbox.Option key={item.value} value={item.value} as={Fragment}>
        {({ selected, active }) => (
          <div
            className={clsx(
              "sid-listbox__item",
              selected && "sid-listbox__item--selected",
              active && styles.activeItem,
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
    </div>
  );
}, areEqual);

Option.displayName = "Option";

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

  // const listRef = useRef<List>(null);

  return (
    <div className="sid-listbox">
      {/* TODO: test SSR */}
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
            {/* <HeadlessListbox.Options as="div">
              <List
                ref={listRef}
                itemCount={items.length}
                itemData={{
                  items,
                }}
                itemSize={50}
                height={250}
                width={350}
              >
                {Option}
              </List>
            </HeadlessListbox.Options> */}
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
        {/* {({ open }) => {
          if (listRef.current && open) {
            listRef.current.scrollToItem(
              items.findIndex((item) => item.value === value),
              "center"
            );
          }

          return (
            <>
              <HeadlessListbox.Button
                className={clsx(
                  "sid-listbox__button",
                  styles.trigger,
                  className
                )}
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
                  <HeadlessListbox.Options as="div">
                    <List
                      ref={listRef}
                      itemCount={items.length}
                      itemData={{
                        items,
                      }}
                      itemSize={50}
                      height={250}
                      width={350}
                    >
                      {Option}
                    </List>
                  </HeadlessListbox.Options>
                </div>
              </div>
            </>
          );
        }} */}
      </HeadlessListbox>
    </div>
  );
};
