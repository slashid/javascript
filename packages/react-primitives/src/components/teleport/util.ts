/**
 * Companion utility for <Teleport />
 *
 * Searches the DOM for a teleport target element
 * with id [teleportId]. If none is found, creates
 * one at the root of the DOM.
 *
 * @param teleportKey the key of teleport target
 *
 * @returns the portal element
 */
export const findOrCreateTeleportTarget = (
  teleportKey: string
): HTMLElement => {
  const element = globalThis.document.getElementById(teleportKey);
  const targetExists = element !== null;

  if (targetExists) return element;

  const teleport = document.createElement("div");
  teleport.id = teleportKey;
  document.body.appendChild(teleport);

  return teleport;
};
