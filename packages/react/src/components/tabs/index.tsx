import { clsx } from "clsx";
import * as RadixTabs from "@radix-ui/react-tabs";
import * as styles from "./tabs.css";

export type Tab = {
  id: string;
  title: string;
  content: React.ReactNode;
};

type Props = {
  tabs: Tab[];
  className?: string;
};

export const Tabs: React.FC<Props> = ({ className, tabs }) => {
  if (!tabs.length) {
    return null;
  }

  return (
    <RadixTabs.Root
      className={clsx("sid-tabs", className)}
      defaultValue={tabs[0].id}
    >
      <RadixTabs.List className={styles.list} aria-label="SlashID Tabs">
        {tabs.map(({ id, title }) => (
          <RadixTabs.Trigger key={id} className={styles.trigger} value={id}>
            {title}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {tabs.map(({ id, content }) => (
        <RadixTabs.Content key={id} value={id}>
          {content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
};
