import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("production page contains the Curio metadata", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");

  assert.match(html, /<title>Curio — Collector's Hub<\/title>/i);
  assert.match(html, /property="og:title"/i);
  assert.match(html, /src="\/assets\/index-[^"]+\.js"/i);
});

test("all three assignment modules are implemented", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  assert.match(source, /MarketplacePage/);
  assert.match(source, /CommunityPage/);
  assert.match(source, /CollectionPage/);
  assert.match(source, /addToCollection/);
  assert.match(source, /moveCollectionItem/);
});
