import { Accordion } from "../accordion";
import { Switch } from "../switch";
import { Text } from "../text";
import { CONSENT_LEVELS_WITHOUT_NONE } from "./constants";
import * as styles from "./style.css";
import { ConsentSettings, ConsentSettingsLevel } from "./types";

type Props = {
  consentSettings: ConsentSettings;
  toggleConsent: (level: ConsentSettingsLevel) => void;
  disabled?: boolean;
};

export const Settings = ({
  consentSettings,
  toggleConsent,
  disabled = false,
}: Props) => {
  return (
    <Accordion
      itemClassName={styles.accordionItem}
      items={CONSENT_LEVELS_WITHOUT_NONE.map((level) => ({
        value: level,
        icon: (
          <Switch
            data-testid={`sid-gdpr-consent-switch-${level}`}
            blocked={level === "necessary"}
            disabled={disabled}
            checked={consentSettings[level]}
            onCheckedChange={() => toggleConsent(level)}
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
