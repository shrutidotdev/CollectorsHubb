import type { Category, Condition } from "./data";

export type Toast = { id: number; message: string; tone: "success" | "info" };

export type MarketFilters = {
  search: string;
  category: Category | "All";
  condition: Condition | "All";
  sort: "newest" | "low" | "high";
  view: "grid" | "list";
};
