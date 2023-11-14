import { GDPRConsent, GDPRConsentLevel } from "@slashid/slashid";
import { clsx } from "clsx";
import { useEffect, useMemo, useReducer } from "react";
import { publicVariables } from "../../theme/theme.css";
import { Button } from "../button";
import { Dialog } from "../dialog";
import { Cookie } from "../icon/cookie";
import { Text } from "../text";
import { ActionButton } from "./action-button";
import { CONSENT_LEVELS_WITHOUT_NONE } from "./constants";
import { Settings } from "./settings";
import { createInitialState, mapConsentsToSettings, reducer } from "./state";
import * as styles from "./style.css";
import { TriggerButton } from "./trigger-button";
import { ActionType, GDPRConsentDialogProps, UpdateGdprConsent } from "./types";

type Props = GDPRConsentDialogProps & {
  consents: GDPRConsent[];
  updateGdprConsent: UpdateGdprConsent;
};

export const ConsentDialog = ({
  consents,
  updateGdprConsent,
  className,
  triggerClassName,
  onSuccess,
  onError,
  container,
  necessaryCookiesRequired = false,
  defaultAcceptAllLevels = [...CONSENT_LEVELS_WITHOUT_NONE],
  defaultRejectAllLevels = ["none"],
  forceConsent = false,
  forceOpen = false,
}: Props) => {
  const initialConsentSettings = useMemo(
    () => ({
      ...mapConsentsToSettings(consents),
      necessary: necessaryCookiesRequired,
    }),
    [consents, necessaryCookiesRequired]
  );

  const initialOpen = useMemo(
    () => (forceOpen ? true : !consents.length),
    [consents.length, forceOpen]
  );

  const [state, dispatch] = useReducer(
    reducer,
    createInitialState(initialConsentSettings, initialOpen)
  );

  const {
    consentSettings,
    activeAction,
    open,
    isLoading,
    hasError,
    isCustomizing,
  } = state;

  const handleUpdate = async (
    consentLevels: GDPRConsentLevel[],
    activeAction: ActionType
  ) => {
    dispatch({ type: "START_ACTION", payload: activeAction });
    try {
      const consents = await updateGdprConsent(consentLevels);
      onSuccess?.(consents);
      dispatch({ type: "SYNC_CONSENT_SETTINGS", payload: consents });
    } catch (error) {
      dispatch({ type: "SET_HAS_ERROR", payload: true });
      onError?.(error);
    } finally {
      dispatch({ type: "COMPLETE_ACTION" });
    }
  };

  const handleSave = async () => {
    const consentLevels = Object.entries(consentSettings)
      .filter(([, value]) => value)
      .map(([key]) => key as GDPRConsentLevel);

    return handleUpdate(consentLevels, "save");
  };

  const handleAccept = () => handleUpdate(defaultAcceptAllLevels, "accept");

  const handleReject = () => handleUpdate(defaultRejectAllLevels, "reject");

  const handleCustomize = () => {
    dispatch({ type: "SET_IS_CUSTOMIZING", payload: true });
  };

  useEffect(() => {
    if (!open) {
      dispatch({ type: "SET_IS_CUSTOMIZING", payload: false });
    }
  }, [open]);

  return (
    <Dialog
      className={clsx("sid-gdpr-consent-dialog", styles.dialog, className)}
      modal={forceConsent}
      dismissable={!forceConsent}
      open={open}
      container={container}
      onOpenChange={(open: boolean) =>
        dispatch({ type: "SET_OPEN", payload: open })
      }
      trigger={<TriggerButton buttonClassName={triggerClassName} />}
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
          {isCustomizing && (
            <Settings
              consentSettings={consentSettings}
              necessaryCookiesRequired={necessaryCookiesRequired}
              toggleConsent={(level) =>
                dispatch({ type: "TOGGLE_CONSENT", payload: level })
              }
              disabled={isLoading}
            />
          )}
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
      )}
      <div className={styles.footer}>
        {isCustomizing && (
          <ActionButton
            testId="sid-gdpr-consent-dialog-save"
            variant="neutralMd"
            label="Save settings"
            hasError={hasError}
            isActive={activeAction === "save"}
            loading={isLoading}
            onClick={handleSave}
            className={styles.saveButton}
          />
        )}
        <ActionButton
          testId="sid-gdpr-consent-dialog-accept"
          variant="secondaryMd"
          label="Accept all"
          hasError={hasError}
          isActive={activeAction === "accept"}
          loading={isLoading}
          onClick={handleAccept}
          className={styles.acceptButton}
        />
        <ActionButton
          testId="sid-gdpr-consent-dialog-reject"
          variant="secondaryMd"
          label="Reject all"
          hasError={hasError}
          isActive={activeAction === "reject"}
          loading={isLoading}
          onClick={handleReject}
          className={styles.rejectButton}
        />
        {!isCustomizing && (
          <Button
            testId="sid-gdpr-consent-dialog-customize"
            variant="ghostMd"
            onClick={handleCustomize}
            disabled={isLoading}
          >
            Customize
          </Button>
        )}
      </div>
    </Dialog>
  );
};
