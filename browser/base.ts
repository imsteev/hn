import { HackerNewsClient } from "../client";
import type { Item } from "../types";
import createBrowser from "./factory";

export class Browser {
  item: Item;
  cli: HackerNewsClient;

  constructor(item: Item) {
    this.item = item;
    this.cli = new HackerNewsClient();
  }

  display() {
    return `${this.item.type}`;
  }

  created() {
    if (this.item.time) {
      return new Date(this.item.time * 1000).toDateString();
    }
    return "";
  }
}
