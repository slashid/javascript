import "@testing-library/jest-dom/extend-expect";
import matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { Request, Response, fetch } from "cross-fetch";
import { afterAll, afterEach, beforeEach, expect } from "vitest";
import "vitest-canvas-mock";
import { server } from "../src/mocks/server";

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
