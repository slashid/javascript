export class MemoryStorage implements Storage {
  private data = new Map<string, string>();

  clear(): void {
    this.data.clear();
  }

  getItem(key: string): string | null {
    return this.data.get(String(key)) ?? null;
  }

  removeItem(key: string): void {
    this.data.delete(String(key));
  }

  key(index: number): string | null {
    return Array.from(this.data.keys())[Number(index)] ?? null;
  }

  setItem(key: string, value: string): void {
    this.data.set(String(key), String(value));
  }

  get length(): number {
    return this.data.size;
  }
}
