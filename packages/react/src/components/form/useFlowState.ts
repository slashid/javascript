import { useEffect, useRef, useState } from "react";

import { useSlashID } from "../../hooks/use-slash-id";
import { Flow, createFlow, FlowState, CreateFlowOptions } from "./flow";

export function useFlowState(opts: CreateFlowOptions = {}) {
  const { logIn, mfa, recover, user, sdkState, sid } = useSlashID();
  const flowRef = useRef<Flow>(createFlow(opts));
  const [state, setState] = useState<FlowState>(flowRef.current.state);

  useEffect(() => {
    const flow = flowRef.current;
    flow.subscribe(setState);

    return () => flow.unsubscribe(setState);
  }, []);

  useEffect(() => {
    if (sdkState !== "ready" || !sid) return;

    flowRef.current.setRecover(recover);
    flowRef.current.setSlashID(sid);
  }, [recover, sdkState, sid]);

  useEffect(() => {
    if (user) {
      flowRef.current.setLogIn(mfa);
    } else {
      flowRef.current.setLogIn(logIn);
    }
  }, [logIn, mfa, user]);

  return state;
}
