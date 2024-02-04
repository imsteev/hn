import { parseArgs } from "util";
import { generateBrowsers } from "./browser/root";
import { HackerNewsClient } from "./client";
import createBrowser from "./browser/factory";

const opts = {
  ask: { type: "boolean", short: "a" },
  job: { type: "boolean", short: "j" },
  top: { type: "boolean", short: "t" },
  new: { type: "boolean", short: "n" },
  best: { type: "boolean", short: "b" },
  show: { type: "boolean", short: "s" },
  verbose: { type: "boolean", short: "v" },
};

async function main() {
  const parsed = parseArgs({
    // @ts-ignore it's fine.
    options: opts,
    allowPositionals: true,
    args: Bun.argv,
  });

  // todo: what happens if multiple storytypes
  let storyType = "";
  for (const [k, v] of Object.entries(parsed.values)) {
    if (v) {
      storyType = k;
      break;
    }
  }

  if (!storyType) {
    console.log("usage: bun index.ts [-a] [-j] [-t] [-n] [-b] [-s] [-v]");
    process.exit(1);
  }

  console.log(`--- browsing ${storyType} posts. press enter to start ---`);
  await readInput();

  let counter = 0;
  const rootIterator = generateBrowsers(storyType, 500, 10);

  const cli = new HackerNewsClient();

  let cmd = "";
  while (true) {
    if (cmd) {
      const itemId = parseInt(cmd);
      const displayKids = cmd.endsWith("k");
      const item = await cli.getItemById(itemId);
      if (item) {
        const bro = createBrowser(item);
        console.log(bro.display());
        if (parsed.values.verbose) {
          console.log("id: " + bro.item.id);
          console.log("parent: " + (bro.item.parent || ""));
          console.log("kids: " + (bro.item.kids || ""));
          console.log("date: " + bro.created());
          console.log("type: " + bro.item.type);
        }
      }
      if (item?.kids && displayKids) {
        const kids = await cli.getItemsByIDs(item.kids);
        kids.map(createBrowser).forEach((bro) => {
          console.log(bro.display());
          console.log("---");
        });
      }
      cmd = await readInput();
      // TODO: explore kids
      continue;
    }
    const rootCursor = await rootIterator.next();
    if (rootCursor.done) {
      continue;
    }
    const browsers = rootCursor.value;
    browsers.forEach((bro) => {
      if (parsed.values.verbose) {
        console.log("id: " + bro.item.id);
        console.log("kids: " + bro.item.kids);
      }
      console.log(bro.display());
      console.log(bro.created());
      console.log();
    });
    // display # of item seen for the last item (current end of list)
    counter += browsers.length;
    console.log(`[${storyType}:${counter}]`);
    cmd = await readInput();
  }
}

async function readInput() {
  for await (const line of console) {
    return line;
  }
  return "";
}

await main();
