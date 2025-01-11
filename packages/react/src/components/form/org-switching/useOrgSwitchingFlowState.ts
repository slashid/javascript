import { useEffect, useRef, useState } from "react";

import { useSlashID } from "../../../hooks/use-slash-id";
import {
  Flow,
  createFlow,
  FlowState,
  CreateFlowOptions,
} from "./org-switching-flow";

export function useFlowState(opts: CreateFlowOptions = {}) {
  const { recover, sdkState, sid, user } = useSlashID();
  const flowRef = useRef<Flow>(createFlow(opts));
  const [state, setState] = useState<FlowState>(flowRef.current.state);

  console.log({ flowState: flowRef.current.state });

  useEffect(() => {
    const flow = flowRef.current;
    flow.subscribe(setState);

    return () => flow.unsubscribe(setState);
  }, []);

  useEffect(() => {
    if (sdkState !== "ready") return;

    flowRef.current.setRecover(recover);
    flowRef.current.setCancel(() => {
      sid?.publish("flowCancelled", undefined);
    });
  }, [recover, sdkState, sid]);

  useEffect(() => {
    if (!user) return;

    flowRef.current.setLogIn(async () => user);
  }, [user]);

  return state;
}
