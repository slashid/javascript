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

    sdk.mockPublish("authnContextUpdateChallengeReceivedEvent", testEvent);
    sdk.mockPublish("authnContextUpdateChallengeReceivedEvent", testEvent);

    eventBuffer.subscribe("authnContextUpdateChallengeReceivedEvent", callback);

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

    expect(callback).toHaveBeenLastCalledWith({
      targetOrgId: "1",
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should only let the first subscriber consume the buffered events", () => {
    const sdk = new MockSlashID({ analyticsEnabled: false, oid: "test" });
    const eventBuffer = createEventBuffer({ sdk });
    const firstCallback = vi.fn();
    const secondCallback = vi.fn();

    const testEvent = {
      targetOrgId: "test org ID",
    };

    // Event before first subscription
    sdk.mockPublish("authnContextUpdateChallengeReceivedEvent", testEvent);

    // Subscribe to the event
    eventBuffer.subscribe(
      "authnContextUpdateChallengeReceivedEvent",
      firstCallback
    );
    eventBuffer.subscribe(
      "authnContextUpdateChallengeReceivedEvent",
      secondCallback
    );

    expect(firstCallback).toHaveBeenCalledTimes(1);
    expect(firstCallback).toHaveBeenCalledWith(testEvent);
    expect(secondCallback).not.toHaveBeenCalled();
  });
});
