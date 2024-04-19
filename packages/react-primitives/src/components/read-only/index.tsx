import { Copy } from "../icon/copy";
import clsx from "clsx";
import * as styles from "./read-only.css";
import { useEffect, useRef } from "react";

type ReadOnlyProps = {
  value: string;
  id: string;
  label?: string;
  as?: "input" | "textarea";
  rows?: number;
  copy?: boolean;
  className?: string;
};

export function ReadOnly({
  id,
  value,
  label,
  as = "input",
  rows,
  copy,
  className,
}: ReadOnlyProps) {
  const Component = as;
  const inputRef = useRef<HTMLElement>(null);

  const copyToClipBoard = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(value);
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

  return (
    <div className={clsx(styles.wrapper, className)}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <Component
        id={id}
        type="text"
        value={value}
        rows={rows}
        className={clsx(styles.field, {
          [styles.fieldWithLabel]: Boolean(label),
          [styles.fieldWithCopy]: copy,
        })}
        readOnly
        disabled
        // @ts-ignore
        ref={inputRef}
      />
      {copy && (
        <button
          type="button"
          onClick={copyToClipBoard}
          className={styles.copyButton}
        >
          <Copy />
        </button>
      )}
    </div>
  );
}
