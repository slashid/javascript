import { Accordion } from "../accordion";
import { Switch } from "../switch";
import { Text } from "../text";
import {
  ConsentSettings,
  Dispatch,
  CONSENT_LEVELS_WITHOUT_NONE,
} from "./state";
import * as styles from "./style.css";

type Props = {
  consentSettings: ConsentSettings;
  dispatch: Dispatch;
  disabled?: boolean;
};

export const Settings = ({
  consentSettings,
  dispatch,
  disabled = false,
}: Props) => {
  return (
    <Accordion
      itemClassName={styles.accordionItem}
      items={CONSENT_LEVELS_WITHOUT_NONE.map((level) => ({
        value: level,
        icon: (
          <Switch
            blocked={level === "necessary"}
            disabled={disabled}
            checked={consentSettings[level]}
            onCheckedChange={() =>
              dispatch({ type: "TOGGLE_CONSENT", payload: level })
            }
          />
        ),
        trigger: (
          <Text
            className={styles.accordionTrigger}
            t={`gdpr.consent.${level}.title`}
            variant={{ weight: "semibold" }}
          />
        ),
        content: (
          <Text
            className={styles.accordionContent}
            t={`gdpr.consent.${level}.description`}
            variant={{ size: "sm", color: "contrast" }}
          />
        ),
      }))}
    />
  );
};
