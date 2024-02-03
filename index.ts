import { Browser } from "./browser/base";
import createBrowser from "./browser/factory";
import { HNClient } from "./client";

const TOP_N_TO_LOOK_AT = 15;
const CHUNK_SIZE = 5;

async function main() {
  const cli = new HNClient();

  const top = await cli.getTopStories();
  for (let i = 0; i < TOP_N_TO_LOOK_AT; i += CHUNK_SIZE) {
    const end = Math.min(i + CHUNK_SIZE, TOP_N_TO_LOOK_AT - 1);
    const items = await cli.getItemsByIDs(top.slice(i, end));
    for (const item of items) {
      const bro = createBrowser(item);
      console.log(bro.display());
      for await (const kid of bro.visitKids()) {
        console.log();
        console.log(kid.display());
        console.log();
      }
      console.log();
    }
  }
}

await main();
