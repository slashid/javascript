import { GDPRConsent } from "@slashid/slashid";
import { clsx } from "clsx";
import { useEffect, useReducer } from "react";
import { useGdprConsent } from "../../hooks/use-gdpr-consent";
import { publicVariables } from "../../theme/theme.css";
import { Button } from "../button";
import { Dialog } from "../dialog";
import { Cookie } from "../icon/cookie";
import { Text } from "../text";
import { Actions } from "./actions";
import { Settings } from "./settings";
import { createInitialState, reducer } from "./state";
import * as styles from "./style.css";

type Props = {
  /** Custom class name */
  className?: string;
  /** Default open state */
  defaultOpen?: boolean;
  /** Callback when user actions are successful */
  onSuccess?: (consentLevels: GDPRConsent[]) => void;
  /** Callback when user actions fail */
  onError?: (error: unknown) => void;
  /**
   * The modality of the dialog.
   * When set to `true`, interaction with outside elements will be disabled and only dialog content will be visible to screen readers.
   * When set to `false`, interaction with outside elements will be enabled and all content will be visible to screen readers.
   */
  modal?: boolean;
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
  const { consents, consentState, updateGdprConsent } = useGdprConsent();
  const [state, dispatch] = useReducer(
    reducer,
    createInitialState(consents, defaultOpen)
  );

  const { consentSettings, open, isLoading, hasError, isCustomizing } = state;

  useEffect(() => {
    if (!open) {
      dispatch({ type: "SET_HAS_ERROR", payload: false });
      dispatch({ type: "SET_IS_CUSTOMIZING", payload: false });
    }
  }, [open]);

  useEffect(() => {
    if (consentState === "initial") {
      return;
    }
    dispatch({
      type: "SET_CONSENT_SETTINGS",
      payload: consents,
    });
  }, [consentState, consents]);

  if (consentState === "initial") {
    return null;
  }

  return (
    <Dialog
      className={clsx(styles.dialog, className)}
      modal={modal}
      open={open}
      onOpenChange={(open: boolean) =>
        dispatch({ type: "SET_OPEN", payload: open })
      }
      // TODO: should trigger be passed as a prop? if yes then dialog CSS needs to be updated
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
          {isCustomizing && (
            <Settings
              consentSettings={consentSettings}
              dispatch={dispatch}
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
        <Actions
          state={state}
          dispatch={dispatch}
          updateGdprConsent={updateGdprConsent}
          onSuccess={onSuccess}
          onError={onError}
        />
      </div>
    </Dialog>
  );
};
