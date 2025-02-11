import { useEffect, useMemo, useRef, useState } from "react";

import { useSlashID } from "../../../hooks/use-slash-id";
import { Flow, createFlow } from "../flow/org-switching-flow";
import { Handle } from "../../../domain/types";
import { FlowState, CreateFlowOptions } from "../flow/flow.common";

export function useOrgSwitchingFlowState(opts: CreateFlowOptions) {
  const { recover, sid, __switchOrganizationInContext, user } = useSlashID();

  const lastUserHandle = useMemo<Handle | undefined>(() => {
    if (!user) return undefined;

    const recentAuthentication = user.authentications[0];
    if (!recentAuthentication) return undefined;

    return recentAuthentication.handle;
  }, [user]);

  const flowRef = useRef<Flow>(
    createFlow({
      lastUserHandle,
      ...opts,
      logInFn: async () => {
        return __switchOrganizationInContext({ oid: opts.oid! });
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
