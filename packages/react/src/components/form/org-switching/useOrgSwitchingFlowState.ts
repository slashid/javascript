import { useEffect, useRef, useState } from "react";

import { useSlashID } from "../../../hooks/use-slash-id";
import {
  Flow,
  createFlow,
  FlowState,
  CreateFlowOptions,
} from "./org-switching-flow";
import { useOrgSwitchingContext } from "./useOrgSwitchingContext";
import { User } from "@slashid/slashid";

export function useFlowState(opts: CreateFlowOptions = {}) {
  const { recover, user, sdkState, sid } = useSlashID();
  const orgSwitchingCtx = useOrgSwitchingContext();
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
    flowRef.current.setCancel(() => {
      sid?.publish("flowCancelled", undefined);
    });
  }, [recover, sdkState, sid]);

  useEffect(() => {
    if (user && orgSwitchingCtx?.state === "switching") {
      flowRef.current.setLogIn = async () => {
        const token = await user.getTokenForOrganization(orgSwitchingCtx.oid);

        return new User(token);
      };
    }
  }, [orgSwitchingCtx, user]);

  return state;
}
