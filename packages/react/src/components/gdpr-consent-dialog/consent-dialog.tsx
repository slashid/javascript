import { GDPRConsent } from "@slashid/slashid";
import { clsx } from "clsx";
import { useEffect, useMemo, useReducer } from "react";
import { publicVariables } from "../../theme/theme.css";
import { Button } from "../button";
import { Dialog } from "../dialog";
import { Cookie } from "../icon/cookie";
import { Text } from "../text";
import { Actions } from "./actions";
import { CONSENT_LEVELS_WITHOUT_NONE } from "./constants";
import { Settings } from "./settings";
import { createInitialState, reducer } from "./state";
import * as styles from "./style.css";
import {
  ConsentSettings,
  GDPRConsentDialogProps,
  UpdateGdprConsent,
} from "./types";

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
  defaultOpen = false,
  necessaryCookiesRequired = false,
  defaultAcceptAllLevels = [...CONSENT_LEVELS_WITHOUT_NONE],
  defaultRejectAllLevels = ["none"],
  modal = true,
}: Props) => {
  const initialConsentSettings: ConsentSettings = useMemo(
    () =>
      Object.fromEntries(
        CONSENT_LEVELS_WITHOUT_NONE.map((level) => [
          level,
          consents.map((c) => c.consent_level).includes(level),
        ])
      ) as ConsentSettings,
    [consents]
  );

  const [state, dispatch] = useReducer(
    reducer,
    createInitialState(initialConsentSettings, defaultOpen || !consents.length)
  );

  const { consentSettings, open, isLoading, hasError, isCustomizing } = state;

  useEffect(() => {
    if (!open) {
      dispatch({ type: "SET_IS_CUSTOMIZING", payload: false });
    }
  }, [open]);

  return (
    <Dialog
      className={clsx("sid-gdpr-consent-dialog", styles.dialog, className)}
      modal={modal}
      open={open}
      onOpenChange={(open: boolean) =>
        dispatch({ type: "SET_OPEN", payload: open })
      }
      trigger={
        <Button
          testId="sid-gdpr-consent-dialog-trigger"
          variant="neutralMd"
          className={clsx(
            "sid-gdpr-consent-dialog-trigger",
            styles.dialogTrigger,
            triggerClassName
          )}
        >
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
          necessaryCookiesRequired={necessaryCookiesRequired}
          defaultAcceptAllLevels={defaultAcceptAllLevels}
          defaultRejectAllLevels={defaultRejectAllLevels}
          dispatch={dispatch}
          updateGdprConsent={updateGdprConsent}
          onSuccess={onSuccess}
          onError={onError}
        />
      </div>
    </Dialog>
  );
};
