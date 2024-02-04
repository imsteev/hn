import type { Item } from "../types";
import { Browser } from "./base";

export class Story extends Browser {
  constructor(item: Item) {
    super(item);
  }
  getParts() {
    return ["title", "url"];
  }
}

export class Job extends Browser {
  constructor(item: Item) {
    super(item);
  }
  getParts() {
    return ["title", "url"];
  }
}

export class Comment extends Browser {
  constructor(item: Item) {
    super(item);
  }
  getParts() {
    return ["text", "by"];
  }
}

export class Poll extends Browser {
  constructor(item: Item) {
    super(item);
  }
  getParts() {
    return ["title", "url"];
  }
}

export class PollOpt extends Browser {
  constructor(item: Item) {
    super(item);
  }
  getParts() {
    return ["text"];
  }
}
