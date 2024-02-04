import type { Item } from "../types";
import { Browser } from "./base";

export class Story extends Browser {
  constructor(item: Item) {
    super(item);
  }

  display() {
    const parts = [this.item.title, this.item.url, this.item.kids.toString()];
    return parts.filter((p) => !!p).join("\n");
  }
}

export class Job extends Browser {
  constructor(item: Item) {
    super(item);
  }

  display() {
    const parts = [this.item.title, this.item.url];
    return parts.filter((p) => !!p).join("\n");
  }
}

export class Comment extends Browser {
  constructor(item: Item) {
    super(item);
  }

  display() {
    const parts = [this.item.text, this.item.by];
    return parts.filter((p) => !!p).join("\n");
  }
}

export class Poll extends Browser {
  constructor(item: Item) {
    super(item);
  }
  display() {
    const parts = [this.item.title, this.item.url];
    return parts.filter((p) => !!p).join("\n");
  }
}

export class PollOpt extends Browser {
  constructor(item: Item) {
    super(item);
  }
  display() {
    return `${this.item.text}`;
  }
}
