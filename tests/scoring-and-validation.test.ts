import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import YAML from "yaml";
import {
  SourcesDocumentSchema,
  TrackerSeedSchema,
  computePriorityScore,
  priorityFromScore,
  validateTrackerData,
} from "@fft/schema";

test("priority scoring preserves the documented weights and thresholds", () => {
  assert.equal(computePriorityScore(5, 4, 3), 4.1);
  assert.equal(priorityFromScore(3.5), "high");
  assert.equal(priorityFromScore(2.5), "medium");
  assert.equal(priorityFromScore(2.49), "low");
});

test("curated data has valid references and no new evidence debt", () => {
  const root = process.cwd();
  const seed = TrackerSeedSchema.parse(
    YAML.parse(fs.readFileSync(path.join(root, "data/seed/baseline-2026-07.yaml"), "utf8")),
  );
  const sources = SourcesDocumentSchema.parse(
    YAML.parse(fs.readFileSync(path.join(root, "data/sources.yaml"), "utf8")),
  );
  const debt = JSON.parse(fs.readFileSync(path.join(root, "data/evidence-debt.json"), "utf8")) as {
    allowedMissingEvidence: string[];
  };
  const result = validateTrackerData(seed, sources, debt.allowedMissingEvidence);
  assert.deepEqual(result.errors, []);
  assert.equal(result.warnings.length, 119);
});

test("validation rejects broken references and newly unsourced claims", () => {
  const seed = TrackerSeedSchema.parse({
    baselineDate: "2026-07-01",
    asOf: "2026-07-23",
    companies: [{ id: "xai", name: "xAI", region: "western", type: "lab" }],
    models: [{ id: "new-model", companyId: "missing-company", name: "New", slug: "new", sourceUrls: [] }],
    products: [],
    features: [],
    matrix: [],
    gaps: [],
    opportunities: [],
    financialSignals: [],
    events: [],
    roadmapItems: [],
  });
  const result = validateTrackerData(seed, { sources: [] }, []);
  assert.ok(result.errors.includes("model:new-model references missing company: missing-company"));
  assert.ok(result.errors.includes("New claim is missing evidence: model:new-model"));
});
