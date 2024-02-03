import { HNClient } from "./client";
import type { Item } from "./types";

class ItemBrowser {
  item: Item;
  cli: HNClient;

  constructor(item: Item) {
    this.item = item;
    this.cli = new HNClient();
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

  // get top stories
  cli.getTopStories().then(async (ids) => {
    const numIDs = 10;
    const chunkSize = 50; // to fetch in parallel
    for (let i = 0; i < numIDs; i += chunkSize) {
      const chunkIDs = ids.slice(i, Math.min(i + chunkSize, numIDs - 1));
      const items = await Promise.all(chunkIDs.map(cli.getItemById.bind(cli))); // GOTCHA: cannot pass simply `cli.getItemById`. if you do so, the function has no `this` context
      for (const item of items) {
        const bro = new ItemBrowser(item);
        console.log(await (await bro.visitUrl()).text());
      }
    }
  });
}

await main();
