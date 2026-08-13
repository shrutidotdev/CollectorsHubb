import type { CollectionName, Condition } from "./data";

export const collectionNames: CollectionName[] = ["Owned", "Wishlist", "Selling"];
export const conditions: Condition[] = ["Mint", "Excellent", "Good", "Fair"];
export const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
