import { Factor } from "@slashid/slashid";
import { describe, expect, test } from "vitest";

import { Handle } from "../../domain/types";
import { Action, init, reducer, Step } from "./initial-state";

const EMAIL: Handle = { type: "email_address", value: "user@acme.test" };
const PHONE: Handle = { type: "phone_number", value: "+15550100" };
const FACTORS: Factor[] = [{ method: "email_link" }, { method: "password" }];

describe("init", () => {
  test("starts idle without a resumed handle", () => {
    expect(init()).toEqual({ step: "idle" });
  });

  test("starts at factor resolution with a resumed handle", () => {
    expect(init(EMAIL)).toEqual({ step: "resolving_factors", handle: EMAIL });
  });
});

describe("reducer", () => {
  describe("submit_handle", () => {
    test("attempts SSO for an email address when enabled", () => {
      const next = reducer(init(), {
        type: "submit_handle",
        handle: EMAIL,
        attemptSSO: true,
      });

      expect(next).toEqual({ step: "attempting_sso", handle: EMAIL });
    });

    test("skips SSO for a non-email handle", () => {
      const next = reducer(init(), {
        type: "submit_handle",
        handle: PHONE,
        attemptSSO: true,
      });

      expect(next).toEqual({ step: "resolving_factors", handle: PHONE });
    });

    test("skips SSO when disabled", () => {
      const next = reducer(init(), {
        type: "submit_handle",
        handle: EMAIL,
        attemptSSO: false,
      });

      expect(next).toEqual({ step: "resolving_factors", handle: EMAIL });
    });
  });

  test("factors_resolved moves to the picker", () => {
    const next = reducer(init(EMAIL), {
      type: "factors_resolved",
      factors: FACTORS,
    });

    expect(next).toEqual({
      step: "picking",
      handle: EMAIL,
      factors: FACTORS,
    });
  });

  test.each(["no_factors", "resolve_error"] as const)(
    "resolve_failed moves to failed with reason %s",
    (reason) => {
      const next = reducer(init(EMAIL), { type: "resolve_failed", reason });

      expect(next).toEqual({ step: "failed", handle: EMAIL, reason });
    }
  );

  test("retry_resolution goes back to resolving the same handle", () => {
    const failed = reducer(init(EMAIL), {
      type: "resolve_failed",
      reason: "resolve_error",
    });

    expect(reducer(failed, { type: "retry_resolution" })).toEqual({
      step: "resolving_factors",
      handle: EMAIL,
    });
  });

  describe("reset", () => {
    test("returns to idle without a resumed handle", () => {
      const picking = reducer(init(EMAIL), {
        type: "factors_resolved",
        factors: FACTORS,
      });

      expect(reducer(picking, { type: "reset" })).toEqual({ step: "idle" });
    });

    test("returns to factor resolution with a resumed handle", () => {
      expect(reducer(init(), { type: "reset", resumedHandle: EMAIL })).toEqual({
        step: "resolving_factors",
        handle: EMAIL,
      });
    });
  });

  test("a resumed step can never reach attempting_sso", () => {
    const resumed = init(EMAIL);
    const actions: Action[] = [
      { type: "factors_resolved", factors: FACTORS },
      { type: "resolve_failed", reason: "no_factors" },
      { type: "resolve_failed", reason: "resolve_error" },
      { type: "retry_resolution" },
      { type: "reset", resumedHandle: EMAIL },
      { type: "reset" },
    ];

    const reachable = new Set<Step["step"]>();
    const visit = (state: Step, depth: number) => {
      reachable.add(state.step);
      if (depth === 0) return;
      actions.forEach((action) => visit(reducer(state, action), depth - 1));
    };
    visit(resumed, 4);

    expect(reachable.has("attempting_sso")).toBe(false);
  });
});
