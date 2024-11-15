import { describe, it, expect, vi } from "vitest";
import { createEventBuffer } from "./event-buffer";
import { MockSlashID } from "../test-utils";

describe("createEventBuffer", () => {
  it("should call the subscriber with buffered events if they were emitted prior to them subscribing", () => {
    const sdk = new MockSlashID({ analyticsEnabled: false, oid: "test" });
    const eventBuffer = createEventBuffer({ sdk });
    const callback = vi.fn();

    const testEvent = {
      targetOrgId: "test org ID",
    };

    // Simulate event emissions
    sdk.mockPublish("authnContextUpdateChallengeReceivedEvent", testEvent);
    sdk.mockPublish("authnContextUpdateChallengeReceivedEvent", testEvent);

    // Subscribe to the event
    eventBuffer.subscribe("authnContextUpdateChallengeReceivedEvent", callback);

    // Verify that the callback is called with the buffered event
    expect(callback).toHaveBeenCalledWith(testEvent);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("should not buffer events if subscribers exist", () => {
    const sdk = new MockSlashID({ analyticsEnabled: false, oid: "test" });
    const eventBuffer = createEventBuffer({ sdk });
    const firstCallback = vi.fn();
    const secondCallback = vi.fn();

    const testEvent = {
      targetOrgId: "test org ID",
    };

    const finalTestEvent = { targetOrgId: "orgId3" };

    // Event before first subscription
    sdk.mockPublish("authnContextUpdateChallengeReceivedEvent", testEvent);

    // Subscribe to the event
    eventBuffer.subscribe(
      "authnContextUpdateChallengeReceivedEvent",
      firstCallback
    );

    // one subscriber
    sdk.mockPublish("authnContextUpdateChallengeReceivedEvent", testEvent);

    eventBuffer.subscribe(
      "authnContextUpdateChallengeReceivedEvent",
      secondCallback
    );

    // two subscribers
    sdk.mockPublish("authnContextUpdateChallengeReceivedEvent", {
      targetOrgId: "orgId3",
    });

    // Verify that the callback is called with the buffered event
    expect(firstCallback).toHaveBeenCalledTimes(3);
    expect(secondCallback).toHaveBeenCalledTimes(1);
    expect(secondCallback).toHaveBeenCalledWith(finalTestEvent);
  });

  it("should not receive events while unsubscribed", () => {
    const sdk = new MockSlashID({ analyticsEnabled: false, oid: "test" });
    const eventBuffer = createEventBuffer({ sdk });
    const callback = vi.fn();

    eventBuffer.subscribe("authnContextUpdateChallengeReceivedEvent", callback);

    sdk.mockPublish("authnContextUpdateChallengeReceivedEvent", {
      targetOrgId: "1",
    });

    eventBuffer.unsubscribe(
      "authnContextUpdateChallengeReceivedEvent",
      callback
    );
    sdk.mockPublish("authnContextUpdateChallengeReceivedEvent", {
      targetOrgId: "2",
    });

    // Subscribe to the event

    // Verify that the callback is called with the buffered event
    expect(callback).toHaveBeenLastCalledWith({
      targetOrgId: "1",
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
