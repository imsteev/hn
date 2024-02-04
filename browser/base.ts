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
    return (
      this.getParts()
        // @ts-ignore
        .map((p) => this.item[p])
        .filter((v) => !!v)
        .join("\n")
    );
  }

  // descendants should override this to determine which
  // parts are the "important" parts worth displaying.
  getParts() {
    return ["type"];
  }

  created() {
    if (this.item.time) {
      const date = new Date(this.item.time * 1000);
      return new Intl.DateTimeFormat("en-US", {
        dateStyle: "short",
      }).format(date);
    }
    return "";
  }
}
