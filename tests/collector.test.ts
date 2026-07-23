import assert from "node:assert/strict";
import test from "node:test";
import { collectorEventId, hashContent, normalizeContent } from "../packages/collectors/src/core.ts";

test("collector normalization ignores scripts, comments, and whitespace noise", () => {
  const first = `<html><body><!-- build 1 --><h1>Launch</h1><script>nonce=1</script></body></html>`;
  const second = `<html>  <body><h1>Launch</h1><script>nonce=2</script> </body></html>`;
  assert.equal(normalizeContent(first), normalizeContent(second));
  assert.equal(hashContent(first), hashContent(second));
});

test("collector event IDs are collision-safe and source scoped", () => {
  const first = collectorEventId("xai-api");
  const second = collectorEventId("xai-api");
  assert.match(first, /^scrape-xai-api-/);
  assert.notEqual(first, second);
});
