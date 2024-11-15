import type { SlashID, PublicReadEvents } from "@slashid/slashid";
import { Utils } from "@slashid/slashid";

export type Event = PublicReadEvents[keyof PublicReadEvents];

type EventNames = keyof PublicReadEvents;

export type EventCallback = (event: Event) => void;

export type CreateEventBufferArgs = {
  sdk: SlashID;
};

export type EventBuffer = {
  subscribe: (eventName: EventNames, handler: EventCallback) => void;
  unsubscribe: (eventName: EventNames, handler: EventCallback) => void;
  destroy: () => void;
};

export function createEventBuffer({ sdk }: CreateEventBufferArgs): EventBuffer {
  const buffer: Map<EventNames, Event[]> = new Map();
  const internalHandlers: Map<EventNames, EventCallback> = new Map();
  const subscribers: Map<EventNames, EventCallback[]> = new Map();

  // listen to all the SDK events on init
  Utils.PUBLIC_READ_EVENTS.forEach((publicReadEventName: EventNames) => {
    // create an event handler
    const handler = (event: Event) => {
      if (subscribers.has(publicReadEventName)) {
        // if there is a subscriber for this event type just ignore
        return;
      }

      // add event to the corresponding buffer
      if (!buffer.has(publicReadEventName)) {
        buffer.set(publicReadEventName, []);
      }

      const existingEvents = buffer.get(publicReadEventName);
      if (existingEvents) {
        existingEvents.push(event);
      }
    };

    // subscribe to the given event
    sdk.subscribe(publicReadEventName, handler);

    // store the handler so we can unsubscribe later
    internalHandlers.set(publicReadEventName, handler);
  });

  /**
   * When you subscribe for an event type with buffered instances, your callback will be called once per each stored event.
   * Event will be consumed and removed from the buffer.
   */
  function subscribe(eventType: EventNames, callback: EventCallback) {
    sdk.subscribe(eventType, callback);

    // add to our list of subscribers
    if (!subscribers.has(eventType)) {
      subscribers.set(eventType, []);
    }

    const existingSubscribers = subscribers.get(eventType);
    if (existingSubscribers) {
      existingSubscribers.push(callback);
    }

    if (buffer.has(eventType)) {
      buffer.get(eventType)!.forEach((event) => callback(event));
      buffer.delete(eventType);
    }
  }

  /**
   * When you unsubscribe we need to remove your callback from the internal list of stored callbacks.
   * This way we know when to buffer (only when there are no subscribers to the given event).
   */
  function unsubscribe(eventType: EventNames, callback: EventCallback) {
    sdk.unsubscribe(eventType, callback);

    if (!subscribers.has(eventType)) {
      return;
    }

    const registeredSubscribers = subscribers.get(eventType);

    if (registeredSubscribers) {
      const newSubscribers = registeredSubscribers.filter(
        (sub) => sub !== callback
      );
      subscribers.set(eventType, newSubscribers);
    }
  }

  function destroy() {
    // unsubscribe
    internalHandlers.entries().forEach(([name, handler]) => {
      sdk.unsubscribe(name, handler);
    });

    // clear
    internalHandlers.keys().forEach((name) => {
      internalHandlers.delete(name);
    });

    subscribers.keys().forEach((name) => {
      subscribers.delete(name);
    });
  }

  return {
    subscribe,
    unsubscribe,
    destroy,
  };
}
