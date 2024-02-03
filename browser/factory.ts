import { Comment, Job, Poll, PollOpt, Story } from ".";
import type { Item } from "../types";
import { Browser } from "./base";

export default function createBrowser(item: Item): Browser {
  switch (item.type) {
    case "story":
      return new Story(item);
    case "comment":
      return new Comment(item);
    case "job":
      return new Job(item);
    case "poll":
      return new Poll(item);
    case "pollopt":
      return new PollOpt(item);
    default:
      return new Browser(item);
  }
}
