import { GDPRConsentLevel } from "@slashid/slashid";
import { useState } from "react";
import { Button } from "../button";
import { ActionButton } from "./action-button";
import { Dispatch, State } from "./state";
import * as styles from "./style.css";
import {
  ConsentSettingsLevel,
  OnError,
  OnSuccess,
  UpdateGdprConsent,
} from "./types";

type ActionType = "save" | "accept" | "reject" | null;

type Props = {
  state: State;
  defaultAcceptAllLevels: ConsentSettingsLevel[];
  defaultRejectAllLevels: GDPRConsentLevel[];
  dispatch: Dispatch;
  updateGdprConsent: UpdateGdprConsent;
  onSuccess?: OnSuccess;
  onError?: OnError;
};

export const Actions = ({
  state,
  defaultAcceptAllLevels,
  defaultRejectAllLevels,
  dispatch,
  updateGdprConsent,
  onSuccess,
  onError,
}: Props) => {
  const [activeAction, setActiveAction] = useState<ActionType>(null);

  const { consentSettings, isLoading, hasError, isCustomizing } = state;

  const showSaveButton = isCustomizing;
  const showCustomize = !isCustomizing;

  const handleUpdate = async (
    consentLevels: GDPRConsentLevel[],
    action: ActionType
  ) => {
    setActiveAction(action);
    dispatch({ type: "START_LOADING" });
    try {
      const consents = await updateGdprConsent(consentLevels);
      onSuccess?.(consents);
      dispatch({ type: "SET_OPEN", payload: false });
    } catch (error) {
      dispatch({ type: "SET_HAS_ERROR", payload: true });
      onError?.(error);
    } finally {
      dispatch({ type: "STOP_LOADING" });
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

  return (
    <>
      {showSaveButton && (
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
      {showCustomize && (
        <Button
          testId="sid-gdpr-consent-dialog-customize"
          variant="ghostMd"
          onClick={handleCustomize}
          disabled={isLoading}
        >
          Customize
        </Button>
      )}
    </>
  );
};
