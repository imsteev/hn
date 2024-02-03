import { HNClient } from "../client";
import type { Item } from "../types";
import createBrowser from "./factory";

export class Browser {
  item: Item;
  cli: HNClient;

  constructor(item: Item) {
    this.item = item;
    this.cli = new HNClient();
  }

  display() {
    return `${this.item.type}`;
  }

  *visitKids() {
    for (const kid of this.item.kids) {
      yield this.cli.getItemById(kid).then((item) => createBrowser(item));
    }
  }

  visitUser() {
    return this.cli.getUserByName(this.item.by);
  }
}
