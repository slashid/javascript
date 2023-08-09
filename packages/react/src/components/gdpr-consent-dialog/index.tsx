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

type ActionType = "save" | "acceptAll" | "rejectAll" | undefined;

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
  const [currentAction, setCurrentAction] = useState<ActionType>();

  const handleUpdate = async (
    consentLevels: GDPRConsentLevel[],
    action: ActionType
  ) => {
    setCurrentAction(action);
    setHasError(false);
    setIsLoading(true);
    try {
      await updateGdprConsent(consentLevels);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (consentLevels) throw new Error("Error");
      onSuccess?.(consentLevels);
      setOpen(false);
    } catch (error) {
      setHasError(true);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    const consentLevels = Object.entries({ ...consentState, necessary: true })
      .filter(([, value]) => value)
      .map(([key]) => key as GDPRConsentLevel);

    return handleUpdate(consentLevels, "save");
  };

  const handleAcceptAll = () => handleUpdate(GDPR_CONSENT_LEVELS, "acceptAll");

  const handleRejectAll = () => handleUpdate(["none"], "rejectAll");

  const handleCustomize = () => {
    setHasError(false);
    setIsCustomizing(true);
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
    // setOpen(defaultOpen || !consents.length);
  }, [consents]);

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
      {(isCustomizing || hasError) && (
        <div
          className={clsx(styles.content, { [styles.errorContent]: hasError })}
        >
          {/* <div className={styles.contentWrapper}> */}
          {isCustomizing && (
            // TODO: pull out accordion to a separate component
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
          )}
          {hasError && (
            // TODO: fix error message layout to show up on any action
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
          {/* </div> */}
        </div>
      )}
      <div className={styles.footer}>
        {isCustomizing && (
          <Button
            variant="neutralMd"
            loading={isLoading && currentAction === "save"}
            disabled={isLoading && currentAction !== "save"}
            onClick={handleSave}
            className={styles.saveButton}
          >
            {hasError && currentAction === "save"
              ? "Try again"
              : "Save settings"}
          </Button>
        )}
        <Button
          variant="secondaryMd"
          loading={isLoading && currentAction === "acceptAll"}
          disabled={isLoading && currentAction !== "acceptAll"}
          onClick={handleAcceptAll}
          className={styles.acceptButton}
        >
          {hasError && currentAction === "acceptAll"
            ? "Try again"
            : "Accept all"}
        </Button>
        {!isCustomizing && (
          <>
            <Button
              variant="secondaryMd"
              loading={isLoading && currentAction === "rejectAll"}
              disabled={isLoading && currentAction !== "rejectAll"}
              onClick={handleRejectAll}
              className={styles.rejectButton}
            >
              {hasError && currentAction === "rejectAll"
                ? "Try again"
                : "Reject all"}
            </Button>
            <Button
              variant="ghostMd"
              onClick={handleCustomize}
              disabled={isLoading}
            >
              Customize
            </Button>
          </>
        )}
      </div>
    </Dialog>
  );
};
