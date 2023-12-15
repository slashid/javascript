import { screen, fireEvent } from "@testing-library/react";
import { TEXT } from "./text/constants";
import { FactorMethod, OrganizationDetails, User } from "@slashid/slashid";
import { faker } from "@faker-js/faker";
import { Handle } from "../domain/types";
import {
  Handler,
  PublicReadEvents,
  SlashID,
  SlashIDOptions,
} from "@slashid/slashid";

export const inputEmail = (
  value: string,
  inputPlaceholder: string = TEXT["initial.handle.phone.email"]
) => {
  const input = screen.getByPlaceholderText(inputPlaceholder);
  fireEvent.change(input, { target: { value } });
};

export const inputPhone = (
  value: string,
  inputPlaceholder: string = TEXT["initial.handle.phone.placeholder"]
) => {
  const input = screen.getByPlaceholderText(inputPlaceholder);
  fireEvent.change(input, { target: { value } });
};

export const TEST_ORG_ID = "ad5399ea-4e88-b04a-16ca-82958c955740";
export const TEST_PERSON_ID =
  "pid:01e43f2419fe994879a64564cd76ab30a8d2ea95e89987c8185cef5ab8f8adf8de643a289c:2";

const TEST_TOKEN_HEADER = "eyJhbGciOiJSUzI1NiIsICJraWQiOiJ2RXBzRmcifQ";
const TEST_TOKEN_PAYLOAD_DECODED = {
  authenticated_methods: ["email_link"],
  exp: 1668775617,
  first_token: false,
  groups: [],
  iat: 1668767017,
  iss: "https://sandbox.slashid.dev",
  jti: "039bbb27c07b69b21762ec0a1a9c2dc5",
  oid: TEST_ORG_ID,
  person_id: TEST_PERSON_ID,
};

const TEST_TOKEN_SIGNATURE =
  "tsyUk3guY29r-jb-Xw2htT0egEO3KUErDSlJu9F9Y_QQAf6Te_DmdPgnCKjR7pTGO1uKvYT6JKit7opyntOA4y_wIhymUOkW5mtX-fgyIF0Fkxx1JjGm4BcTE9rI1tH7DWG177yTzwJ2kv5OYvTknpn_QK8s6JzD1N5Yq11_VNf2dRN_NXb-0feqDGhXU7lR-oO7wqFlt37pzENQ7-tG3JDt9uCKqSbrtXqxTHGtg80ZY3FxXYYiHNC3v0nXV5aFRhxGvIIm9LgNkZwXkEtSecIqFHWJn2-ILuOFpvcmtmlZr8AxQyNMAKMt1fARf2LJy45qITI2IyVTndtDekT6HQ";

type Authentication = {
  factor: FactorMethod;
  handle: Handle;
  timestamp: string;
};

type CreateTestUserOptions = {
  authMethods?: FactorMethod[];
  oid?: string;
  authentications?: Authentication[];
  token?: string;
};

/**
 * Creates new User instance.
 * NOTE: This function DOES NOT use or generate a valid token, only one that is easily decoded
 * for the purpose of testing the SDK. To be used in the tests ONLY.
 *
 * @param options CreateTestUserOptions
 * @returns User
 */
export function createTestUser({
  authMethods,
  oid,
  authentications,
  token,
}: CreateTestUserOptions = {}): User {
  const payload = token
    ? JSON.parse(atob(token.split(".")[1]))
    : TEST_TOKEN_PAYLOAD_DECODED;

  const newToken = [
    TEST_TOKEN_HEADER,
    btoa(
      JSON.stringify({
        ...payload,
        ...(authMethods ? { authenticated_methods: authMethods } : {}),
        ...(oid ? { oid } : {}),
        ...(authentications ? { authentications } : {}),
      })
    ),
    TEST_TOKEN_SIGNATURE,
  ].join(".");

  return new User(newToken);
}

const createBaseOrg = () => ({
  id: faker.string.uuid(),
  org_name: faker.company.buzzPhrase(),
  tenant_name: faker.company.buzzPhrase(),
});

export const createTestOrganization = (): OrganizationDetails => ({
  ...createBaseOrg(),
  managed_organizations: Array.from(
    Array(faker.number.int({ min: 1, max: 3 }))
  ).map(() => createBaseOrg()),
});

export const createTestPerson = () => ({
  active: true,
  person_id: faker.string.uuid(),
  region: faker.location.countryCode(),
});

/**
 * Radix UI depends Element.onhasPointerCapture, the DOM implementation
 * in our testing setup has not implemented this.
 *
 * https://github.com/testing-library/user-event/discussions/1087
 */
export const polyfillPointerEvent = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).PointerEvent = class PointerEvent extends Event {};
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
  window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  window.HTMLElement.prototype.releasePointerCapture = vi.fn();
};

/**
 * This class is a wrapper on top of the SlashID instance, with mocked
 * pubsub mechanism. This allows us to test all subscription-related logic
 * with ease, without the need of accessing private SlashID emitter property.
 */
export class MockSlashID extends SlashID {
  private _observers: Map<keyof PublicReadEvents, GenericHandler[]> = new Map()

  private get observers() {
    if (!this._observers) this._observers = new Map()
    return this._observers
  }

  constructor(opts?: SlashIDOptions) {
    super(opts);
  }

  public subscribe<Key extends keyof PublicReadEvents>(
    type: Key,
    handler: Handler<PublicReadEvents[Key]>
  ): void {
    const handlers = this.observers.get(type);
    if (handlers) {
      handlers.push(handler as GenericHandler);
    } else {
      this.observers.set(type, [handler as GenericHandler]);
    }
  }

  public unsubscribe<Key extends keyof PublicReadEvents>(
    type: Key,
    handler: Handler<PublicReadEvents[Key]>
  ): void {
    const handlers = this.observers.get(type);
    if (handlers) {
      if (handler) {
        handlers.splice(handlers.indexOf(handler as GenericHandler) >>> 0, 1);
      } else {
        this.observers.set(type, []);
      }
    }
  }

  public mockPublish<Key extends keyof PublicReadEvents>(
    type: Key,
    payload: PublicReadEvents[Key]
  ): void {
    const handlers = this.observers.get(type);
    if (handlers) {
      handlers.forEach((handler) => handler(payload));
    }
  }
}

type GenericHandler = Handler<PublicReadEvents[keyof PublicReadEvents]>;
