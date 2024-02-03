export class Cache<TItem> {
  _cache!: Record<any, TItem>;
  _string: number;
  constructor() {
    this._cache = {};
    this._string = 123;
  }
  set(id: number, item: TItem) {
    this._cache[id] = item;
  }
  get(id: number): TItem | null {
    return this._cache[id];
  }
}
