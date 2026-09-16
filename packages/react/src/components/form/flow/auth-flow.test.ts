import { Errors, User } from "@slashid/slashid";
import { describe, expect, test, vi } from "vitest";

import { Handle } from "../../../domain/types";
import { createAuthFlow, Flow } from "./auth-flow";
import {
  AuthenticatingState,
  CreateFlowOptions,
  ErrorState,
  FlowState,
  InitialState,
} from "./flow.common";

const HANDLE: Handle = { type: "email_address", value: "user@acme.test" };

const hookUnresolved = () =>
  Errors.createSlashIDError({
    name: Errors.ERROR_NAMES.hookFactorUnresolved,
    message: "unresolved",
  });

/**
 * The flow only performs a login once the SDK dependencies are set, and
 * `logIn` never resolving keeps the flow in `authenticating` so tests can
 * deliver their own outcome.
 */
function setup(opts: CreateFlowOptions = {}) {
  const flow = createAuthFlow(opts);
  const logIn = vi.fn(() => new Promise<User | undefined>(() => {}));

  flow.setLogIn(logIn);
  flow.setRecover(vi.fn());
  flow.setCancel(vi.fn());

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

function asInitial(state: FlowState): InitialState {
  if (state.status !== "initial") {
    throw new Error(`expected initial, got ${state.status}`);
  }
  return state;
}

function asAuthenticating(state: FlowState): AuthenticatingState {
  if (state.status !== "authenticating") {
    throw new Error(`expected authenticating, got ${state.status}`);
  }
  return state;
}

function asError(state: FlowState): ErrorState {
  if (state.status !== "error") {
    throw new Error(`expected error, got ${state.status}`);
  }
  return state;
}

/**
 * Drives the flow to `authenticating` and performs the login, which the
 * authenticating state leaves to its consumer rather than doing on entry.
 */
function logInWith(
  ctx: ReturnType<typeof setup>,
  factor: { method: string },
  handle: Handle | undefined = HANDLE
) {
  asInitial(ctx.state).logIn({
    // @ts-expect-error tests drive the machine with arbitrary factor methods
    factor,
    handle,
  });
  const authenticating = asAuthenticating(ctx.state);
  authenticating.logIn();
  return authenticating;
}

describe("createAuthFlow", () => {
  test("starts in the initial state with no resumed handle", () => {
    const { state } = setup();

    expect(asInitial(state).resumedHandle).toBeUndefined();
  });

  test("sid_login moves to authenticating with the given config", () => {
    const ctx = setup();

    const authenticating = logInWith(ctx, { method: "email_link" });

    expect(authenticating.context.config).toEqual({
      factor: { method: "email_link" },
      handle: HANDLE,
    });
    expect(authenticating.context.attempt).toBe(1);
  });

  describe("an unresolved SSO attempt", () => {
    test("returns to initial carrying the handle instead of erroring", async () => {
      const onError = vi.fn();
      const ctx = setup({ onError });
      const error = hookUnresolved();
      ctx.logIn.mockImplementation(() => Promise.reject(error));

      logInWith(ctx, { method: "hook" });
      await vi.waitFor(() => expect(ctx.state.status).toBe("initial"));

      expect(asInitial(ctx.state).resumedHandle).toEqual(HANDLE);
      expect(onError).not.toHaveBeenCalled();
    });

    test("is reported as an error when the factor is not hook", async () => {
      const onError = vi.fn();
      const ctx = setup({ onError });
      const error = hookUnresolved();
      ctx.logIn.mockImplementation(() => Promise.reject(error));

      logInWith(ctx, { method: "email_link" });
      await vi.waitFor(() => expect(ctx.state.status).toBe("error"));

      expect(asError(ctx.state).context.error).toBe(error);
      expect(onError).toHaveBeenCalledTimes(1);
    });
  });

  describe("any other failure of an SSO attempt", () => {
    test.each([
      ["a plain error", new Error("network down")],
      [
        "an API response error",
        Errors.createSlashIDError({
          name: Errors.ERROR_NAMES.rateLimitError,
          message: "slow down",
        }),
      ],
    ])("is reported as an error: %s", async (_label, error) => {
      const onError = vi.fn();
      const ctx = setup({ onError });
      ctx.logIn.mockImplementation(() => Promise.reject(error));

      logInWith(ctx, { method: "hook" });
      await vi.waitFor(() => expect(ctx.state.status).toBe("error"));

      expect(asError(ctx.state).context.error).toBe(error);
      expect(asError(ctx.state).context.config.factor).toEqual({
        method: "hook",
      });
      expect(onError).toHaveBeenCalledTimes(1);
    });
  });

  test("retrying a hook context keeps the hook factor and bumps the attempt", async () => {
    const ctx = setup();
    ctx.logIn.mockImplementation(() => Promise.reject(new Error("network")));

    logInWith(ctx, { method: "hook" });
    await vi.waitFor(() => expect(ctx.state.status).toBe("error"));

    ctx.logIn.mockImplementation(() => new Promise<User | undefined>(() => {}));
    asError(ctx.state).retry("retry");

    const authenticating = asAuthenticating(ctx.state);
    authenticating.logIn();
    expect(authenticating.context.config.factor).toEqual({ method: "hook" });
    expect(authenticating.context.attempt).toBe(2);
  });

  test("retry then unresolved still returns to initial with the handle", async () => {
    const onError = vi.fn();
    const ctx = setup({ onError });
    ctx.logIn.mockImplementation(() => Promise.reject(new Error("network")));

    logInWith(ctx, { method: "hook" });
    await vi.waitFor(() => expect(ctx.state.status).toBe("error"));

    ctx.logIn.mockImplementation(() => Promise.reject(hookUnresolved()));
    asError(ctx.state).retry("retry");
    asAuthenticating(ctx.state).logIn();

    await vi.waitFor(() => expect(ctx.state.status).toBe("initial"));
    expect(asInitial(ctx.state).resumedHandle).toEqual(HANDLE);
    expect(onError).toHaveBeenCalledTimes(1);
  });

  test("retrying with the reset policy returns to initial with no handle", async () => {
    const ctx = setup();
    ctx.logIn.mockImplementation(() => Promise.reject(new Error("nope")));

    logInWith(ctx, { method: "hook" });
    await vi.waitFor(() => expect(ctx.state.status).toBe("error"));

    asError(ctx.state).retry("reset");

    expect(asInitial(ctx.state).resumedHandle).toBeUndefined();
  });

  test("cancelling from a resumed initial state clears the handle", async () => {
    const ctx = setup();
    ctx.logIn.mockImplementation(() => Promise.reject(hookUnresolved()));

    logInWith(ctx, { method: "hook" });
    await vi.waitFor(() => expect(ctx.state.status).toBe("initial"));
    expect(asInitial(ctx.state).resumedHandle).toEqual(HANDLE);

    asInitial(ctx.state).cancel();

    expect(asInitial(ctx.state).resumedHandle).toBeUndefined();
  });

  describe("observers", () => {
    const transition = (flow: Flow) => {
      const state = flow.history[flow.history.length - 1].state;
      if (state.status === "initial") {
        state.logIn({ factor: { method: "email_link" }, handle: HANDLE });
      }
    };

    test("unsubscribing removes only the given observer", () => {
      const flow = createAuthFlow();
      flow.setLogIn(vi.fn(() => new Promise<User | undefined>(() => {})));
      flow.setRecover(vi.fn());
      const kept = vi.fn();
      const removed = vi.fn();

      flow.subscribe(kept);
      flow.subscribe(removed);
      flow.unsubscribe(removed);
      transition(flow);

      expect(kept).toHaveBeenCalledTimes(1);
      expect(removed).not.toHaveBeenCalled();
    });

    test("resubscribing after unsubscribing notifies once per transition", () => {
      const flow = createAuthFlow();
      flow.setLogIn(vi.fn(() => new Promise<User | undefined>(() => {})));
      flow.setRecover(vi.fn());
      const observer = vi.fn();

      flow.subscribe(observer);
      flow.unsubscribe(observer);
      flow.subscribe(observer);
      transition(flow);

      expect(observer).toHaveBeenCalledTimes(1);
    });
  });
});
