import * as RadixAccordion from "@radix-ui/react-accordion";
import { clsx } from "clsx";
import { ReactNode } from "react";
import { ChevronLeft } from "../icon/chevron-left";
import * as styles from "./style.css";

type Item = {
  /** Unique value of the item */
  value: string;
  /** Icon to display next to the trigger */
  icon?: ReactNode;
  /** Trigger to toggle the collapsed state of its associated item */
  trigger: ReactNode;
  /** Content to display when the item is expanded */
  content: ReactNode;
};

type Props = {
  /** List of items to display */
  items: Item[];
  /** Custom class name for the accordion */
  className?: string;
  /** Custom class name for each item */
  itemClassName?: string;
};

/**
 * Accordion component built on top of Radix Accordion primitives to display a list of items
 * that can be expanded and collapsed. It supports multiple items expanded at the same time.
 */
export const Accordion = ({ items, className, itemClassName }: Props) => (
  <RadixAccordion.Root
    className={clsx("sid-accordion", className)}
    type="multiple"
  >
    {items.map(({ value, trigger, icon, content }) => (
      <RadixAccordion.Item key={value} value={value} className={itemClassName}>
        <RadixAccordion.Header className={styles.header}>
          <RadixAccordion.Trigger className={styles.trigger}>
            <ChevronLeft className={styles.chevron} />
            {trigger}
          </RadixAccordion.Trigger>
          {icon && <div>{icon}</div>}
        </RadixAccordion.Header>
        <RadixAccordion.Content className={styles.content}>
          {content}
        </RadixAccordion.Content>
      </RadixAccordion.Item>
    ))}
  </RadixAccordion.Root>
);
