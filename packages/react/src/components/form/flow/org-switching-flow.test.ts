import { Errors, User } from "@slashid/slashid";
import { describe, expect, test, vi } from "vitest";

import { Handle } from "../../../domain/types";
import { createOrgSwitchingFlow } from "./org-switching-flow";
import { FlowState } from "./flow.common";

const HANDLE: Handle = { type: "email_address", value: "user@acme.test" };

/**
 * The flow builds its authenticating state on construction, capturing the
 * login function, so it has to arrive through the options rather than setLogIn.
 */
function setup(opts: Parameters<typeof createOrgSwitchingFlow>[0] = {}) {
  const logIn = vi.fn(() => new Promise<User | undefined>(() => {}));
  const flow = createOrgSwitchingFlow({
    lastUserHandle: HANDLE,
    logInFn: logIn,
    recover: vi.fn(),
    ...opts,
  });

  let state: FlowState = flow.history[0].state;
  flow.subscribe((next) => {
    state = next;
  });

  return {
    flow,
    logIn,
    get state() {
      return state;
    },
  };
}

describe("createOrgSwitchingFlow", () => {
  test("reports an unresolved hook factor as an error", async () => {
    const onError = vi.fn();
    const ctx = setup({ onError });
    const error = Errors.createSlashIDError({
      name: Errors.ERROR_NAMES.hookFactorUnresolved,
      message: "unresolved",
    });
    ctx.logIn.mockImplementation(() => Promise.reject(error));

    const initial = ctx.state;
    if (initial.status !== "authenticating") {
      throw new Error(`expected authenticating, got ${initial.status}`);
    }
    initial.logIn();

    await vi.waitFor(() => expect(ctx.state.status).toBe("error"));
    expect(onError).toHaveBeenCalledTimes(1);
  });

  test("unsubscribing removes only the given observer", () => {
    const ctx = setup();
    const kept = vi.fn();
    const removed = vi.fn();

    ctx.flow.subscribe(kept);
    ctx.flow.subscribe(removed);
    ctx.flow.unsubscribe(removed);

    const state = ctx.state;
    if (state.status !== "authenticating") {
      throw new Error(`expected authenticating, got ${state.status}`);
    }
    state.updateContext(state.context);

    expect(kept).toHaveBeenCalledTimes(1);
    expect(removed).not.toHaveBeenCalled();
  });
});
