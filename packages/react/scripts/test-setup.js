import { expect, afterEach, beforeEach, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";
import matchers from "@testing-library/jest-dom/matchers";
import "@testing-library/jest-dom/extend-expect";
import { server } from "../src/mocks/server";
import { fetch, Request, Response } from "cross-fetch";

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);
// polyfill for browser APIs
global.fetch = fetch;
global.Request = Request;
global.Response = Response;

beforeEach(() => {
  // msw
  server.listen({
    onUnhandledRequest: "error",
  });
});

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  server.resetHandlers();
  cleanup();
});

afterAll(() => {
  server.close();
});
