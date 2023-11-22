import { useEffect, useState } from "react";
import { Card } from "../card";
import { InitialState } from "./flow.initial";
import type { Challenges, State, FlowType } from "./flow.types";
import { useAppContext } from "../app/app.context";

function getFlowTypeFromChallenges(challenges: Challenges): FlowType {
  console.log(challenges);

  // challenges=W3siaWQiOiJWM0FtcGpUVUpiX2VNVk1Ob2luUC13Iiwib3B0aW9ucyI6eyJjaGFsbGVuZ2UiOiJNMlJMR0hwUGVUb0pKVm9hNmZqangxd3M3eU5QQkZyWWJReDlLbXZmZVU1RkFMeWN0MFRROEdlZ3lhTkFpLTA5X2F3UjNWOVVmQktseDU1bl9TNTlldyJ9LCJ0eXBlIjoibm9uY2UifV0

  return "catch-all";
}

export function Flow() {
  const [flowState] = useState<State>("initial");
  const { sdk, state: appState } = useAppContext();

  useEffect(() => {
    if (appState !== "ready") return;

    async function processChallenges() {
      if (appState !== "ready") return;

      const challenges = await sdk.getChallengesFromURL();

      if (!challenges) {
        console.log("No challenges found");
        return;
      }

      const flowType = getFlowTypeFromChallenges(challenges);

      console.log(flowType);
    }

    processChallenges();
  }, [appState, sdk]);

  return <Card>{flowState === "initial" && <InitialState />}</Card>;
}
