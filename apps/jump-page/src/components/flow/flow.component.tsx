import { useEffect, useState } from "react";
import { Card } from "../card";
import { Initial } from "./flow.initial";
import { Error } from "./flow.error";
import type { Challenges, State, FlowType } from "./flow.types";
import { useAppContext } from "../app/app.context";
import { Progress } from "./flow.progress";

function getFlowTypeFromChallenges(challenges: Challenges): FlowType {
  console.log(challenges);

  // challenges=W3siaWQiOiJWM0FtcGpUVUpiX2VNVk1Ob2luUC13Iiwib3B0aW9ucyI6eyJjaGFsbGVuZ2UiOiJNMlJMR0hwUGVUb0pKVm9hNmZqangxd3M3eU5QQkZyWWJReDlLbXZmZVU1RkFMeWN0MFRROEdlZ3lhTkFpLTA5X2F3UjNWOVVmQktseDU1bl9TNTlldyJ9LCJ0eXBlIjoibm9uY2UifV0

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

      const challenges = await sdk.getChallengesFromURL();

      if (!challenges) {
        setFlowState({ state: "no-challenges", challenges: null });
        return;
      }

      const flowType = getFlowTypeFromChallenges(challenges);

      setFlowState({ state: "progress", challenges, flowType });
    }

    processChallenges();
  }, [appState, flowState.state, sdk]);

  return (
    <Card>
      {(appState !== "ready" || flowState.state === "parsing-url") && (
        <Initial />
      )}
      {appState === "ready" && (
        <>
          {flowState.state === "progress" && <Progress />}
          {flowState.state === "no-challenges" && <Error type="warning" />}
        </>
      )}
    </Card>
  );
}
