import * as RadixAccordion from "@radix-ui/react-accordion";
import { clsx } from "clsx";
import { ReactNode } from "react";
import { ChevronLeft } from "../icon/chevron-left";
import * as styles from "./style.css";

type Item = {
  value: string;
  icon?: ReactNode;
  trigger: ReactNode;
  content: ReactNode;
};

type Props = {
  items: Item[];
  className?: string;
};

export const Accordion = ({ items, className }: Props) => (
  <RadixAccordion.Root
    className={clsx("sid-accordion", styles.accordion, className)}
    type="multiple"
  >
    {items.map(({ value, trigger, icon, content }) => (
      <RadixAccordion.Item key={value} value={value}>
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
