import { GDPRConsentLevel } from "@slashid/slashid";
import { useState } from "react";
import { useGdprConsent } from "../../hooks/use-gdpr-consent";
import { Button } from "../button";
import { Dispatch, GDPR_CONSENT_LEVELS, State } from "./state";
import * as styles from "./style.css";

type ActionType = "save" | "accept" | "reject" | undefined;

type Props = {
  state: State;
  dispatch: Dispatch;
  onSuccess?: (consentLevels: GDPRConsentLevel[]) => void;
  onError?: (error: unknown) => void;
};

export const Actions = ({ state, dispatch, onSuccess, onError }: Props) => {
  const { updateGdprConsent } = useGdprConsent();
  const [activeAction, setActiveAction] = useState<ActionType>();

  const { consentSettings, isLoading, hasError, isCustomizing } = state;

  const isSaveActionActive = activeAction === "save";
  const isAcceptActionActive = activeAction === "accept";
  const isRejectActionActive = activeAction === "reject";

  const handleUpdate = async (
    consentLevels: GDPRConsentLevel[],
    action: ActionType
  ) => {
    setActiveAction(action);
    dispatch({ type: "START_LOADING" });
    try {
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      // if (consentLevels) throw new Error("Error");
      await updateGdprConsent(consentLevels);
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
    const consentLevels = Object.entries({
      ...consentSettings,
      necessary: true,
    })
      .filter(([, value]) => value)
      .map(([key]) => key as GDPRConsentLevel);

    return handleUpdate(consentLevels, "save");
  };

  const handleAccept = () =>
    handleUpdate(
      GDPR_CONSENT_LEVELS as unknown as GDPRConsentLevel[],
      "accept"
    );

  const handleReject = () => handleUpdate(["none"], "reject");

  const handleCustomize = () => {
    dispatch({ type: "SET_HAS_ERROR", payload: false });
    dispatch({ type: "SET_IS_CUSTOMIZING", payload: true });
  };

  return (
    <>
      {isCustomizing && (
        <Button
          variant="neutralMd"
          loading={isLoading && isSaveActionActive}
          disabled={isLoading && !isSaveActionActive}
          onClick={handleSave}
          className={styles.saveButton}
        >
          {hasError && isSaveActionActive ? "Try again" : "Save settings"}
        </Button>
      )}
      <Button
        variant="secondaryMd"
        loading={isLoading && isAcceptActionActive}
        disabled={isLoading && !isAcceptActionActive}
        onClick={handleAccept}
        className={styles.acceptButton}
      >
        {hasError && isAcceptActionActive ? "Try again" : "Accept "}
      </Button>
      {!isCustomizing && (
        <>
          <Button
            variant="secondaryMd"
            loading={isLoading && isRejectActionActive}
            disabled={isLoading && !isRejectActionActive}
            onClick={handleReject}
            className={styles.rejectButton}
          >
            {hasError && isRejectActionActive ? "Try again" : "Reject "}
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
    </>
  );
};
