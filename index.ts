import { root } from "./browser/root";
import { HackerNewsClient } from "./client";

async function main() {
  const cli = new HackerNewsClient();
  const rootIterator = root("best", 50, 2);
  for await (const storyChunk of rootIterator) {
    for (const story of storyChunk) {
      console.log(story.display());
      console.log(story.created());
      console.log();
    }
    // wait for user to hit key before going to next "page"
    for await (const _ of console) {
      break;
    }
  }
}

await main();
