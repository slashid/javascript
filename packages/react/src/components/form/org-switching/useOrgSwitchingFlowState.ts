import { useEffect, useRef, useState } from "react";

import { useSlashID } from "../../../hooks/use-slash-id";
import {
  Flow,
  createFlow,
  FlowState,
  CreateFlowOptions,
} from "./org-switching-flow";

export function useOrgSwitchingFlowState(opts: CreateFlowOptions) {
  const { recover, sid, __switchOrganizationInContext } = useSlashID();

  const flowRef = useRef<Flow>(
    createFlow({
      ...opts,
      logInFn: async () => {
        return __switchOrganizationInContext({ oid: opts.oid });
      },
      recover,
      cancelFn: () => {
        sid?.publish("flowCancelled", undefined);
      },
    })
  );
  const [state, setState] = useState<FlowState>(flowRef.current.state);

  useEffect(() => {
    const flow = flowRef.current;
    flow.subscribe(setState);

    return () => flow.unsubscribe(setState);
  }, []);

  return state;
}
