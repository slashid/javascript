import * as RadixTabs from "@radix-ui/react-tabs";
import * as styles from "./tabs.css";

export const Tabs = () => {
  return (
    <RadixTabs.Root className="sid-tabs" defaultValue="tab1">
      <RadixTabs.List className={styles.list} aria-label="Tabs">
        <RadixTabs.Trigger className={styles.trigger} value="tab1">
          Account
        </RadixTabs.Trigger>
        <RadixTabs.Trigger className={styles.trigger} value="tab2">
          Password
        </RadixTabs.Trigger>
      </RadixTabs.List>
      <RadixTabs.Content className="RadixTabsContent" value="tab1">
        <h2>Tab 1</h2>
      </RadixTabs.Content>
      <RadixTabs.Content className="RadixTabsContent" value="tab2">
        <h2>Tab 2</h2>
      </RadixTabs.Content>
    </RadixTabs.Root>
  );
};
