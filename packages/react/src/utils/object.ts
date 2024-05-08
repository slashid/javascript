/**
 * Object.entries(...) with type information
 */
export const toEntries = <T extends object>(obj: T): Entries<T> => {
  return Object.entries(obj) as Entries<T>;
};

export type Entries<T extends object> = {
  [K in keyof T]-?: [K, T[K]];
}[keyof T][];

/**
 * Object.keys(...) with type information
 */
export const toKeys = <T extends object>(obj: T): Keys<T> => {
  return Object.keys(obj) as Keys<T>;
};

export type Keys<T extends object> = { [K in keyof T]-?: K }[keyof T][];

/**
 * Object.values(...) with type information
 */
export const toValues = <T extends object>(obj: T): Values<T> => {
  return Object.values(obj) as Values<T>;
};

export type Values<T extends object> = T[keyof T][];
