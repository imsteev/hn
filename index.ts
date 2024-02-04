import { parseArgs } from "util";
import { generateBrowsers } from "./browser/root";
import { HackerNewsClient } from "./client";
import createBrowser from "./browser/factory";

const opts = {
  verbose: { type: "boolean", short: "v" },
};

const live = ["ask", "job", "top", "new", "best", "show"];

async function main() {
  const parsed = parseArgs({
    // @ts-ignore it's fine.
    options: opts,
    allowPositionals: true,
    args: Bun.argv,
  });

  console.log(`--- press enter to start, or ---`);
  console.log(`--- ${live} ---`);
  let cmd = await readInput();

  const cli = new HackerNewsClient();
  let rootIterator;
  let storyType;

  console.log(cmd);
  let counter = 0;
  while (true) {
    if (cmd === "h") {
      console.log(`--- press enter to start, or ---`);
      console.log(`--- ${live} ---`);
      cmd = await readInput();
    } else if (cmd && live.find((w) => w.startsWith(cmd))) {
      const newStoryType = live.find((w) => w.startsWith(cmd)) || "top";
      if (newStoryType !== storyType) {
        console.log({ newStoryType });
        rootIterator = generateBrowsers(newStoryType, 500, 2);
        counter = 0;
      }
      storyType = newStoryType;
    } else if (cmd) {
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
        console.log();
        kids.map(createBrowser).forEach((bro) => {
          console.log("\t" + bro.display());
          console.log("\t" + "---");
        });
      }
      cmd = await readInput();
      // TODO: explore kids
      continue;
    }

    // do this if no command
    if (rootIterator) {
      const rootCursor = await rootIterator.next();
      if (rootCursor.done) {
        rootIterator = null;
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
}

async function readInput() {
  for await (const line of console) {
    return line;
  }
  return "";
}

await main();
