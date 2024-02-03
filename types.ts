export type Item = {
  id: number;
  deleted: boolean;
  type: "job" | "story" | "comment" | "poll" | "pollopt";
  by: string;
  time: string; // created at, unix time
  dead: boolean;
  parent: string; // either another comment or relevant story
  poll: string; // poll option's associated poll
  kids: number[]; // id's of comments, ranked in display order
  url: string;
  score: number; // store score or votes
  title: string;
  text: string;
  parts: number[]; // list of pollopts
  descendants: number; // total comment count
};
