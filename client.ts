import type { Item } from "./types";

export class HNClient {
  _c: Cache<Item>;
  url = "https://hacker-news.firebaseio.com/v0/";

  constructor() {
    this._c = new Cache<Item>();
  }

  async getItemById(id: number) {
    const item = this._c.get(id);
    if (item) {
      return Promise.resolve(item);
    }
    return fetch(`${this.url}/item/${id}.json`)
      .then((r) => r.json() as unknown as Item)
      .then((j) => {
        if (j.id) {
          this._c.set(j.id, j);
        }
        return j;
      });
  }

  async getItemsByIDs(ids: number[]) {
    return Promise.all(ids.map(this.getItemById.bind(this)));
  }

  getUserByName(username: string) {
    return fetch(`${this.url}/users/${username}.json`)
      .then((r) => r.json() as unknown as Item)
      .then((j) => {
        if (j.id) {
          this._c.set(j.id, j);
        }
        return j;
      });
  }

  getTopStories() {
    return fetch(`${this.url}/topstories.json`).then(
      (r) => r.json() as unknown as number[]
    );
  }
}

class Cache<TItem> {
  _cache!: Record<any, TItem>;
  constructor() {
    this._cache = {};
  }
  set(id: number, item: TItem) {
    this._cache[id] = item;
  }
  get(id: number): TItem | null {
    return this._cache[id];
  }
}
