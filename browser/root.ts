import { HackerNewsClient } from "../client";
import createBrowser from "./factory";

const CHUNK_SIZE = 5;

// const storyTypes = ["new", "top", "best", "ask", "show", "job"];

function chooseRootBrowsers(cli: HackerNewsClient, storyType: string) {
  switch (storyType) {
    case "new":
      return cli.getNewStories();
    case "top":
      return cli.getTopStories();
    case "best":
      return cli.getBestStories();
    case "ask":
      return cli.getAskStories();
    case "show":
      return cli.getShowStories();
    case "job":
    case "jobs":
      return cli.getJobStories();
  }
  return [];
}

export async function* generateBrowsers(
  storyType: string,
  maxItems = 500,
  chunkSize = 1
) {
  const cli = new HackerNewsClient();
  const rootIDs = await chooseRootBrowsers(cli, storyType);
  for (let i = 0; i < maxItems; i += chunkSize) {
    const j = Math.min(i + chunkSize, maxItems - 1);
    const items = await cli.getItemsByIDs(rootIDs.slice(i, j));
    yield items.map(createBrowser);
  }
}
