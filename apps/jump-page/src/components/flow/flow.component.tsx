import { useEffect, useState } from "react";
import { Card } from "../card";
import { Initial } from "./flow.initial";
import { Error } from "./flow.error";
import type { Challenges, State, FlowType } from "./flow.types";
import { useAppContext } from "../app/app.context";
import { Progress } from "./flow.progress";
import type { ChallengeListInner } from "@slashid/slashid";
import { Success } from "./flow.success";
import { captureException } from "@sentry/react";
import { ensureError } from "./flow.domain";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getFlowTypeFromChallenges(challenges: Challenges): FlowType {
  // TODO treat passwords as a special case
  return "catch-all";
}

export function Flow() {
  const [flowState, setFlowState] = useState<State>({ state: "initial" });
  const { sdk, state: appState } = useAppContext();

  useEffect(() => {
    if (flowState.state !== "initial") return;

    async function processChallenges() {
      if (!sdk) return;
      setFlowState({ state: "parsing-url" });

      let challenges: ChallengeListInner[] | null = [];

      try {
        challenges = await sdk.getChallengesFromURL();
      } catch (e: unknown) {
        captureException(ensureError(e));
      }

      if (!challenges) {
        setFlowState({ state: "no-challenges", challenges: null });
        return;
      }

      const flowType = getFlowTypeFromChallenges(challenges);

      setFlowState({ state: "progress", challenges, flowType });
    }

    processChallenges();
  }, [appState, flowState.state, sdk]);

  const handleSuccess = () => {
    if (flowState.state !== "progress") return;

    setFlowState({
      state: "success",
      challenges: flowState.challenges,
      flowType: flowState.flowType,
    });
  };

  const handleError = ({ error }: { error: Error }) => {
    if (flowState.state !== "progress") return;

    setFlowState({
      state: "error",
      challenges: flowState.challenges,
      flowType: flowState.flowType,
      error,
    });
  };

  return (
    <Card>
      {(appState !== "ready" || flowState.state === "parsing-url") && (
        <Initial />
      )}
      {appState === "ready" && (
        <>
          {flowState.state === "progress" && (
            <Progress onSuccess={handleSuccess} onError={handleError} />
          )}
          {flowState.state === "no-challenges" && <Error type="warning" />}
          {flowState.state === "success" && <Success />}
          {flowState.state === "error" && <Error type="error" />}
        </>
      )}
    </Card>
  );
}
