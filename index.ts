import { parseArgs } from "util";
import { root } from "./browser/root";

async function main() {
  const opts = {
    ask: { type: "boolean", short: "a" },
    job: { type: "boolean", short: "j" },
    top: { type: "boolean", short: "t" },
    new: { type: "boolean", short: "n" },
    best: { type: "boolean", short: "b" },
    show: { type: "boolean", short: "s" },
  };
  const parsed = parseArgs({
    args: Bun.argv,
    // @ts-ignore blegh
    options: opts,
    allowPositionals: true,
  });

  // todo: what happens if multiple storytypes
  let storyType = "";
  for (const [k, v] of Object.entries(parsed.values)) {
    if (v) {
      storyType = k;
      break;
    }
  }

  const iterator = root(storyType, 50, 5);
  for await (const storyChunk of iterator) {
    for (const story of storyChunk) {
      console.log(story.display());
      console.log(story.created());
      console.log();
    }
    console.log("press any key");
    await readLine();
  }
}

async function readLine() {
  for await (const _ of console) {
    return;
  }
}

await main();
