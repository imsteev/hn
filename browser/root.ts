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

export async function* root(storyType: string, maxItems = 200, chunkSize = 10) {
  const cli = new HackerNewsClient();
  const rootIDs = await chooseRootBrowsers(cli, storyType);
  for (let i = 0; i < maxItems; i += chunkSize) {
    const end = Math.min(i + chunkSize, maxItems - 1);
    yield cli
      .getItemsByIDs(rootIDs.slice(i, end))
      .then((items) => items.map(createBrowser));
  }
}
