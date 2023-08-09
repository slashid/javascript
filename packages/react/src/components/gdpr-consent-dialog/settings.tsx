import { Accordion } from "../accordion";
import { Switch } from "../switch";
import { Text } from "../text";
import { TextConfigKey } from "../text/constants";
import { ConsentSettings, Dispatch, GDPR_CONSENT_LEVELS } from "./state";
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
      items={GDPR_CONSENT_LEVELS.map((level) => ({
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
            t={`gdpr.consent.${level}.title` as TextConfigKey}
            variant={{ weight: "semibold" }}
          />
        ),
        content: (
          <Text
            className={styles.accordionContent}
            t={`gdpr.consent.${level}.description` as TextConfigKey}
            variant={{ size: "sm", color: "contrast" }}
          />
        ),
      }))}
    />
  );
};
