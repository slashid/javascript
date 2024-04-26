import { Copy } from "../icon/copy";
import clsx from "clsx";
import * as styles from "./read-only-field.css";
import { useEffect, useRef, useState } from "react";
import { Check } from "../icon";

type ReadOnlyPropsField = {
  value: string;
  id: string;
  label?: string;
  as?: "input" | "textarea" | "div";
  rows?: number;
  copy?: boolean;
  className?: string;
  fieldClassName?: string;
};

/**
 *  A component used to display read-only values in forms, with optional right accessory to copy the value to clipboard.
 */
export function ReadOnlyField({
  id,
  value,
  label,
  as = "input",
  rows,
  copy,
  className,
  fieldClassName,
}: ReadOnlyPropsField) {
  const Component = as;
  const inputRef = useRef<HTMLElement>(null);
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipBoard = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(value);
      setHasCopied(true);
    }
  };

  // prevent horizontal scrolling
  useEffect(() => {
    inputRef.current?.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
      },
      { passive: false }
    );
  }, []);

  useEffect(() => {
    if (hasCopied) {
      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    }
  }, [hasCopied]);

  return (
    <div className={clsx(styles.wrapper, className)}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      {as === "div" ? (
        <Component
          id="id"
          className={clsx(
            styles.field,
            {
              [styles.fieldWithLabel]: Boolean(label),
              [styles.fieldWithCopy]: copy,
            },
            fieldClassName
          )}
        >
          {value.split("\n").map((v) => (
            <span key={v}>{v}</span>
          ))}
        </Component>
      ) : (
        <Component
          id={id}
          type="text"
          value={value}
          rows={rows}
          className={clsx(
            styles.field,
            {
              [styles.fieldWithLabel]: Boolean(label),
              [styles.fieldWithCopy]: copy,
            },
            fieldClassName
          )}
          readOnly
          disabled
          // @ts-ignore
          ref={inputRef}
        />
      )}

      {copy && (
        <button
          type="button"
          onClick={copyToClipBoard}
          className={clsx(styles.copyButton, {
            [styles.copyButtonWithLabel]: Boolean(label),
          })}
        >
          {hasCopied ? <Check /> : <Copy />}
        </button>
      )}
    </div>
  );
}
