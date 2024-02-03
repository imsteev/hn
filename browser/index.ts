import type { Item } from "../types";
import { Browser } from "./base";

export class Story extends Browser {
  constructor(item: Item) {
    super(item);
  }

  display() {
    return `${this.item.title}
${this.item.url}
By: ${this.item.by}`;
  }
}

export class Job extends Browser {
  constructor(item: Item) {
    super(item);
  }

  display() {
    return `${this.item.title}
${this.item.text}
By: ${this.item.by}`;
  }
}

export class Comment extends Browser {
  constructor(item: Item) {
    super(item);
  }

  display() {
    return `comment: ${this.item.text}
By: ${this.item.by}`;
  }
}

export class Poll extends Browser {
  constructor(item: Item) {
    super(item);
  }

  display() {
    return `poll: ${this.item.title}
${this.item.url}
By: ${this.item.by}`;
  }
}

export class PollOpt extends Browser {
  constructor(item: Item) {
    super(item);
  }

  display() {
    return `poll opt: ${this.item.text}`;
  }
}
