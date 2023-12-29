import { set, get, getAll, remove } from "tiny-cookie";

export class CookieStorage implements Storage {
  clear(): void {
    const all = getAll();

    const keys = Object.keys(all);

    for (const key of keys) {
      remove(String(key));
    }
  }

  getItem(key: string): string | null {
    return get(String(key));
  }

  removeItem(key: string): void {
    remove(String(key));
  }

  key(index: number): string | null {
    return [...Object.keys(getAll())][Number(index)] ?? null;
  }

  setItem(key: string, value: string): void {
    set(String(key), String(value));
  }

  get length(): number {
    return Object.keys(getAll()).length;
  }
}
