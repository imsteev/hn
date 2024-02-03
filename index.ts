import { HNClient } from "./client";
import type { Item } from "./types";

class ItemBrowser {
  item: Item;
  cli: HNClient;

  constructor(item: Item) {
    this.item = item;
    this.cli = new HNClient();
  }

  display() {
    return `${this.item.title}
${this.item.url}
By: ${this.item.by}`;
  }

  *visitKids() {
    for (const kid of this.item.kids) {
      yield this.cli.getItemById(kid);
    }
  }

  visitUser() {
    return this.cli.getUserByName(this.item.by);
  }

  visitUrl() {
    return fetch(this.item.url);
  }
}

async function main() {
  const cli = new HNClient();

  const top = await cli.getTopStories();
  const numIDs = top.length;
  const chunkSize = 50; // to fetch in parallel
  let itemNum = 1;
  for (let i = 0; i < numIDs; i += chunkSize) {
    const end = Math.min(i + chunkSize, numIDs - 1);
    const items = await cli.getItemsByIDs(top.slice(i, end));
    for (const item of items) {
      const bro = new ItemBrowser(item);
      console.log(itemNum + ": " + bro.display());
      console.log();
      itemNum++;
    }
  }
}

await main();
