import { useEffect, useRef, useState } from "react";

import { useSlashID } from "../../hooks/use-slash-id";
import { Flow, createFlow, FlowState, CreateFlowOptions } from "./flow";

export function useFlowState(opts: CreateFlowOptions = {}) {
  const { logIn, mfa, recover, user, sdkState } = useSlashID();
  const flowRef = useRef<Flow>(createFlow(opts));
  const [state, setState] = useState<FlowState>(flowRef.current.state);

  useEffect(() => {
    const flow = flowRef.current;
    flow.subscribe(setState);

    return () => flow.unsubscribe(setState);
  }, []);

  useEffect(() => {
    if (sdkState !== "ready") return;

    flowRef.current.setRecover(recover);
  }, [recover, sdkState]);

  useEffect(() => {
    if (user && !user.anonymous) {
      flowRef.current.setLogIn(mfa);
    } else {
      flowRef.current.setLogIn(logIn);
    }
  }, [logIn, mfa, user]);

  return state;
}
