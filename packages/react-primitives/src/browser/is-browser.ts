/**
 * Helper function to check if current runtime is a browser, mainly for SSR.
 *
 * @returns boolean
 */
export function isBrowser(): boolean {
  return typeof window !== "undefined" && globalThis === window;
}
