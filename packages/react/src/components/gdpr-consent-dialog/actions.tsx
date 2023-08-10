import { GDPRConsentLevel } from "@slashid/slashid";
import { useState } from "react";
import { Button } from "../button";
import { ActionButton } from "./action-button";
import { Dispatch, GDPR_CONSENT_LEVELS, State } from "./state";
import * as styles from "./style.css";

type ActionType = "save" | "accept" | "reject" | null;

type Props = {
  state: State;
  dispatch: Dispatch;
  updateGdprConsent: (consentLevels: GDPRConsentLevel[]) => Promise<void>;
  onSuccess?: (consentLevels: GDPRConsentLevel[]) => void;
  onError?: (error: unknown) => void;
};

export const Actions = ({
  state,
  dispatch,
  updateGdprConsent,
  onSuccess,
  onError,
}: Props) => {
  const [activeAction, setActiveAction] = useState<ActionType>(null);

  const { consentSettings, isLoading, hasError, isCustomizing } = state;

  const handleUpdate = async (
    consentLevels: GDPRConsentLevel[],
    action: ActionType
  ) => {
    setActiveAction(action);
    dispatch({ type: "START_LOADING" });
    try {
      // TODO: remove this after finishing testing loading and error states
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      // if (consentLevels) throw new Error("Error");

      await updateGdprConsent(consentLevels);
      // TODO: return GDPRConsent[] instead
      onSuccess?.(consentLevels);
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

  const handleAccept = () => handleUpdate([...GDPR_CONSENT_LEVELS], "accept");

  // TODO: include necessary here?
  const handleReject = () => handleUpdate(["none"], "reject");

  const handleCustomize = () => {
    dispatch({ type: "SET_HAS_ERROR", payload: false });
    dispatch({ type: "SET_IS_CUSTOMIZING", payload: true });
  };

  return (
    <>
      {isCustomizing && (
        <ActionButton
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
        variant="secondaryMd"
        label="Accept all"
        hasError={hasError}
        isActive={activeAction === "accept"}
        loading={isLoading}
        onClick={handleAccept}
        className={styles.acceptButton}
      />
      {!isCustomizing && (
        <>
          <ActionButton
            variant="secondaryMd"
            label="Reject all"
            hasError={hasError}
            isActive={activeAction === "reject"}
            loading={isLoading}
            onClick={handleReject}
            className={styles.rejectButton}
          />
          <Button
            variant="ghostMd"
            onClick={handleCustomize}
            disabled={isLoading}
          >
            Customize
          </Button>
        </>
      )}
    </>
  );
};
