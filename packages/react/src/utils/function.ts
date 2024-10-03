/**
 * Return the first non-null result of the given functions.
 */
export function or<I, O>(...funcs: ((input: I) => O)[]) {
  return (input: I) => {
    for (const func of funcs) {
      const result = func(input);
      if (result) {
        return result;
      }
    }
    return null;
  };
}
