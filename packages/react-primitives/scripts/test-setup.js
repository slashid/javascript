import "@testing-library/jest-dom/extend-expect";
import matchers from "@testing-library/jest-dom/matchers";
import { Request, Response, fetch } from "cross-fetch";
import { expect } from "vitest";
import "vitest-canvas-mock";

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);
// polyfill for browser APIs
global.fetch = fetch;
global.Request = Request;
global.Response = Response;
global.navigator.sendBeacon = () => {};
