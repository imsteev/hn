import { root } from "./browser/root";
import { HackerNewsClient } from "./client";

async function main() {
  const cli = new HackerNewsClient();
  for await (const storyChunk of root("best")) {
    for (const story of storyChunk) {
      console.log(story.display());
      console.log(story.created());
      console.log();
    }
  }
}

await main();
