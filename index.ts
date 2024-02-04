import { parseArgs } from "util";
import { generateBrowsers } from "./browser/root";
import { HackerNewsClient } from "./client";
import createBrowser from "./browser/factory";
import type { Browser } from "./browser/base";

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

  const cli = new HackerNewsClient();
  let rootIterator;
  let storyType;
  let counter = 0;

  renderHelp();
  for await (const cmd of console) {
    const liveCmd = live.find((w) => !!cmd && w.startsWith(cmd));
    if (cmd === "h") {
      renderHelp();
    } else if (liveCmd) {
      const newStoryType = liveCmd;
      if (newStoryType !== storyType) {
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
        renderBrowser(bro, !!parsed.values.verbose);
      }
      if (item?.kids && displayKids) {
        const kids = await cli.getItemsByIDs(item.kids);
        kids.map(createBrowser).forEach((bro) => {
          console.log("\t" + bro.display());
          console.log("\t" + "---");
        });
      }
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
        renderBrowser(bro, !!parsed.values.verbose);
      });
      // display # of item seen for the last item (current end of list)
      counter += browsers.length;
      console.log(`[${storyType}:${counter}]`);
    }
  }
}

function renderHelp() {
  console.log(`--- press enter to start, or ---`);
  console.log(`--- ${live} ---`);
}

function renderBrowser(bro: Browser, verbose = false) {
  if (verbose) {
    console.log("id: " + bro.item.id);
    console.log("parent: " + (bro.item.parent || ""));
    console.log("kids: " + (bro.item.kids || ""));
    console.log("date: " + bro.created());
    console.log("type: " + bro.item.type);
  }
  console.log(bro.display());
  console.log(bro.created());
  console.log();
}

async function readInput() {
  for await (const line of console) {
    return line;
  }
  return "";
}

await main();
