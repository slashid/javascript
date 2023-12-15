import { Accordion, Switch } from "@slashid/react-primitives";
import { Text } from "../text";
import { CONSENT_LEVELS_WITHOUT_NONE } from "./constants";
import {
  ConsentSettings,
  ConsentSettingsLevel,
  GDPRConsentDialogProps,
} from "./types";

import * as styles from "./style.css";

type Props = {
  consentSettings: ConsentSettings;
  necessaryCookiesRequired?: GDPRConsentDialogProps["necessaryCookiesRequired"];
  toggleConsent: (level: ConsentSettingsLevel) => void;
  disabled?: boolean;
};

export const Settings = ({
  consentSettings,
  necessaryCookiesRequired = false,
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
            blocked={level === "necessary" && necessaryCookiesRequired}
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
