import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import {
  SourcesDocumentSchema,
  TrackerSeedSchema,
  validateTrackerData,
} from "@fft/schema";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const seedPath = path.join(repoRoot, "data", "seed", "baseline-2026-07.yaml");
const sourcesPath = path.join(repoRoot, "data", "sources.yaml");
const debtPath = path.join(repoRoot, "data", "evidence-debt.json");

const seed = TrackerSeedSchema.parse(YAML.parse(fs.readFileSync(seedPath, "utf8")));
const sources = SourcesDocumentSchema.parse(YAML.parse(fs.readFileSync(sourcesPath, "utf8")));
const debt = JSON.parse(fs.readFileSync(debtPath, "utf8")) as {
  allowedMissingEvidence: string[];
};
const result = validateTrackerData(seed, sources, debt.allowedMissingEvidence);

if (result.errors.length > 0) {
  for (const error of result.errors) console.error(`ERROR ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `Validated ${seed.companies.length} companies, ${seed.matrix.length} matrix cells, ` +
      `${seed.roadmapItems.length} roadmap items, and ${sources.sources.length} sources.`,
  );
}
console.log(`Evidence debt: ${result.warnings.length} known claims; new debt: ${result.errors.filter((error) => error.includes("missing evidence")).length}.`);
