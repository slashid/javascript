import { useEffect, useRef, useState } from "react";

import { useSlashID } from "../../hooks/use-slash-id";
import { Flow, createFlow, FlowState } from "./flow";

export function useFlowState() {
  const { logIn } = useSlashID();
  const flowRef = useRef<Flow>(createFlow());
  const [state, setState] = useState<FlowState>(flowRef.current.state);

  useEffect(() => {
    const flow = flowRef.current;
    flow.subscribe(setState);

    return () => flow.unsubscribe(setState);
  }, []);

  useEffect(() => {
    flowRef.current.setLogIn(logIn);
  }, [logIn]);

  return state;
}
