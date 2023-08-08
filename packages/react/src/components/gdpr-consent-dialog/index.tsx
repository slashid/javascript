import { GDPRConsent, GDPRConsentLevel } from "@slashid/slashid";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { useGdprConsent } from "../../hooks/use-gdpr-consent";
import { publicVariables } from "../../theme/theme.css";
import { Accordion } from "../accordion";
import { Button } from "../button";
import { Dialog } from "../dialog";
import { Cookie } from "../icon/cookie";
import { Switch } from "../switch";
import { Text } from "../text";
import { TextConfigKey } from "../text/constants";
import * as styles from "./style.css";

type Props = {
  /** Custom class name */
  className?: string;
  /** Default open state */
  defaultOpen?: boolean;
  /** Callback when user actions are successful */
  onSuccess?: (consentLevels: GDPRConsentLevel[]) => void;
  /** Callback when user actions fail */
  onError?: (error: unknown) => void;
  /**
   * The modality of the dialog.
   * When set to `true`, interaction with outside elements will be disabled and only dialog content will be visible to screen readers.
   * When set to `false`, interaction with outside elements will be enabled and all content will be visible to screen readers.
   */
  modal?: boolean;
  // TODO: customised text
};

const GDPR_CONSENT_LEVELS: GDPRConsentLevel[] = [
  "necessary",
  "analytics",
  "marketing",
  "retargeting",
  "tracking",
];

type ConsentState = Record<GDPRConsentLevel, boolean>;

const getConsentState = (consents: GDPRConsent[]) => {
  const consentLevels = Object.fromEntries(
    GDPR_CONSENT_LEVELS.map((level) => [
      level,
      consents.map((c) => c.consent_level).includes(level),
    ])
  );
  return consentLevels as ConsentState;
};

/**
 * GDPR Consent Dialog component to manage the GDPR consent levels for the current user.
 */
export const GDPRConsentDialog = ({
  className,
  onSuccess,
  onError,
  defaultOpen = false,
  modal = true,
}: Props) => {
  const { consents, updateGdprConsent } = useGdprConsent();
  const [consentState, setConsentState] = useState(getConsentState(consents));
  const [open, setOpen] = useState(defaultOpen || !consents.length);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);

  const close = () => setOpen(false);

  const handleSave = async () => {
    try {
      const consentLevels = Object.entries({ ...consentState, necessary: true })
        .filter(([, value]) => value)
        .map(([key]) => key as GDPRConsentLevel);

      setHasError(false);
      setIsLoading(true);
      await updateGdprConsent(consentLevels);
      close();
      onSuccess?.(consentLevels);
    } catch (error) {
      setHasError(true);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptAll = () => {
    try {
      // TODO: do we need to await here?
      updateGdprConsent(GDPR_CONSENT_LEVELS);
      close();
      onSuccess?.(GDPR_CONSENT_LEVELS);
    } catch (error) {
      onError?.(error);
    }
  };

  const handleReject = () => {
    try {
      // TODO: do we need to await here?
      updateGdprConsent(["none"]);
      close();
      // TODO: onSuccess or onError?
      onSuccess?.(["none"]);
    } catch (error) {
      onError?.(error);
    }
  };

  useEffect(() => {
    if (!open) {
      setHasError(false);
      setIsCustomizing(false);
    }
  }, [open]);

  useEffect(() => {
    setConsentState(getConsentState(consents));
    // TODO: fix defaultOpen while consents are loading
    setOpen(defaultOpen || !consents.length);
  }, [consents, defaultOpen]);

  return (
    <Dialog
      className={clsx(styles.dialog, className)}
      modal={modal}
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button variant="neutralMd" className={styles.dialogTrigger}>
          <Cookie />
        </Button>
      }
      icon={<Cookie fill={publicVariables.color.primary} />}
    >
      <div className={styles.title}>
        <Text t="gdpr.dialog.title" variant={{ weight: "bold" }} />
        <Text
          t="gdpr.dialog.subtitle"
          variant={{ weight: "semibold", color: "contrast" }}
        />
      </div>
      {isCustomizing && (
        <div className={styles.content}>
          <div className={styles.contentWrapper}>
            <Accordion
              itemClassName={styles.accordionItem}
              items={Object.keys(consentState).map((level) => ({
                value: level,
                icon: (
                  <Switch
                    blocked={level === "necessary"}
                    disabled={isLoading}
                    checked={consentState[level as GDPRConsentLevel]}
                    onCheckedChange={(checked) =>
                      setConsentState((prev) => ({
                        ...prev,
                        [level]: checked,
                      }))
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
            {hasError && (
              <div className={styles.errorWrapper}>
                <Text
                  t="gdpr.dialog.error.title"
                  variant={{
                    weight: "semibold",
                    color: "contrast",
                  }}
                />
                <Text
                  t="gdpr.dialog.error.subtitle"
                  variant={{ weight: "semibold", color: "tertiary" }}
                />
              </div>
            )}
          </div>
        </div>
      )}
      <div className={styles.footer}>
        {isCustomizing && (
          <Button
            variant="neutralMd"
            loading={isLoading}
            onClick={handleSave}
            className={styles.saveButton}
          >
            {hasError ? "Try again" : "Save settings"}
          </Button>
        )}
        <Button
          variant="secondaryMd"
          onClick={handleAcceptAll}
          disabled={isLoading}
        >
          Accept all
        </Button>
        {!isCustomizing && (
          <>
            <Button variant="secondaryMd" onClick={handleReject}>
              Reject all
            </Button>
            <Button variant="ghostMd" onClick={() => setIsCustomizing(true)}>
              Customize
            </Button>
          </>
        )}
      </div>
    </Dialog>
  );
};
