export type Cancellable<T> = { promise: Promise<T>; cancel: () => void };

/**
 * Wraps a promise in a cancellable object. Promise is executed immediately.
 */
export function createCancellable<T>(promise: Promise<T>): Cancellable<T> {
  let isCancelled = false;

  const wrappedPromise = new Promise<T>((resolve, reject) => {
    promise
      .then((result) => {
        console.log("promise resolved", { isCancelled });
        if (!isCancelled) {
          resolve(result);
        }
      })
      .catch((error) => {
        console.log("promise rejected", { isCancelled });
        if (!isCancelled) {
          reject(error);
        }
      });
  });

  const cancel = () => {
    isCancelled = true;
  };

  return { promise: wrappedPromise, cancel };
}
