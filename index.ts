import { parseArgs } from "util";
import { generateBrowsers } from "./browser/root";

const opts = {
  ask: { type: "boolean", short: "a" },
  job: { type: "boolean", short: "j" },
  top: { type: "boolean", short: "t" },
  new: { type: "boolean", short: "n" },
  best: { type: "boolean", short: "b" },
  show: { type: "boolean", short: "s" },
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
    console.log("usage: bun index.ts [-a] [-j] [-t] [-n] [-b] [-s]");
    process.exit(1);
  }

  const iterator = generateBrowsers(storyType, 500, 2);
  for await (const browsers of iterator) {
    browsers.forEach((bro) => {
      console.log(bro.display());
      console.log(bro.created());
      console.log();
    });
    console.log("--- press enter to continue---");
    const input = await readInput();
  }
}

async function readInput() {
  for await (const line of console) {
    return line;
  }
}

await main();
