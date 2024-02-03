import { HackerNewsClient } from "../client";
import createBrowser from "./factory";

const TOP_N_TO_LOOK_AT = 15;
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

export async function* root(storyType: string) {
  const cli = new HackerNewsClient();
  const rootIDs = await chooseRootBrowsers(cli, storyType);
  for (let i = 0; i < TOP_N_TO_LOOK_AT; i += CHUNK_SIZE) {
    const end = Math.min(i + CHUNK_SIZE, TOP_N_TO_LOOK_AT - 1);
    yield cli
      .getItemsByIDs(rootIDs.slice(i, end))
      .then((items) => items.map(createBrowser));
  }
}
