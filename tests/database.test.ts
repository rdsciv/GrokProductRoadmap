import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import YAML from "yaml";
import {
  getCompetitiveCoverage,
  getPortfolioSummary,
  insertEvent,
  insertScrapeRun,
  migrate,
  openDb,
  seedDatabase,
  updateSourceCheck,
} from "@fft/db";

const fixedNow = () => new Date("2026-07-23T12:00:00.000Z");

test("reseeding is idempotent and preserves collector operational history", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "fft-db-"));
  const dbPath = path.join(temp, "tracker.db");
  try {
    seedDatabase(dbPath, { now: fixedNow });
    const first = openDb(dbPath).sqlite;
    migrate(first);
    updateSourceCheck(first, "xai-api", {
      lastCheckedAt: "2026-07-23T11:00:00.000Z",
      lastHash: "preserved-hash",
      lastStatus: "ok",
    });
    insertScrapeRun(first, {
      sourceId: "xai-api",
      startedAt: "2026-07-23T11:00:00.000Z",
      finishedAt: "2026-07-23T11:00:01.000Z",
      status: "ok",
      changeDetected: true,
      contentHash: "preserved-hash",
    });
    insertEvent(first, {
      id: "scrape-xai-api-test",
      eventType: "other",
      companyId: "xai",
      title: "Source change",
      summary: "Test collector event",
      occurredAt: "2026-07-23",
      sourceUrl: "https://x.ai/api",
      severity: "info",
      tags: ["scrape"],
    });
    first.close();

    seedDatabase(dbPath, { now: fixedNow });
    const second = openDb(dbPath).sqlite;
    const source = second.prepare(`SELECT last_hash FROM sources WHERE id = ?`).get("xai-api") as { last_hash: string };
    const runs = second.prepare(`SELECT COUNT(*) AS count FROM scrape_runs`).get() as { count: number };
    const collectorEvents = second.prepare(`SELECT COUNT(*) AS count FROM events WHERE origin = 'collector'`).get() as { count: number };
    assert.equal(source.last_hash, "preserved-hash");
    assert.equal(runs.count, 1);
    assert.equal(collectorEvents.count, 1);
    assert.deepEqual(getPortfolioSummary(second), {
      roadmapItems: 11,
      now: 5,
      next: 4,
      later: 2,
      highConfidence: 5,
      highGaps: 8,
      pillars: 6,
    });
    assert.ok(getCompetitiveCoverage(second).some((row) => row.companyId === "xai"));
    second.close();
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test("a failed seed rolls back to the prior curated state", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "fft-rollback-"));
  const dbPath = path.join(temp, "tracker.db");
  const badSeedPath = path.join(temp, "bad-seed.yaml");
  try {
    seedDatabase(dbPath, { now: fixedNow });
    const seed = YAML.parse(fs.readFileSync(path.join(process.cwd(), "data/seed/baseline-2026-07.yaml"), "utf8"));
    seed.models[0].companyId = "missing-company";
    fs.writeFileSync(badSeedPath, YAML.stringify(seed));
    assert.throws(() => seedDatabase(dbPath, { seedPath: badSeedPath, now: fixedNow }));
    const sqlite = openDb(dbPath).sqlite;
    const companies = sqlite.prepare(`SELECT COUNT(*) AS count FROM companies`).get() as { count: number };
    const roadmap = sqlite.prepare(`SELECT COUNT(*) AS count FROM roadmap_items`).get() as { count: number };
    assert.equal(companies.count, 16);
    assert.equal(roadmap.count, 11);
    sqlite.close();
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test("weekly reports support deterministic dates and include portfolio status", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "fft-report-"));
  const dbPath = path.join(temp, "tracker.db");
  const reportPath = path.join(temp, "weekly.md");
  try {
    seedDatabase(dbPath, { now: fixedNow });
    const result = spawnSync(
      process.execPath,
      ["--import", "tsx", "scripts/generate-weekly-report.ts"],
      {
        cwd: process.cwd(),
        env: {
          ...process.env,
          FFT_DB_PATH: dbPath,
          FFT_REPORT_DATE: "2026-07-23",
          FFT_REPORT_OUT: reportPath,
        },
        encoding: "utf8",
      },
    );
    assert.equal(result.status, 0, result.stderr);
    const report = fs.readFileSync(reportPath, "utf8");
    assert.match(report, /^# Weekly CI Summary — 2026-07-23/m);
    assert.match(report, /## Portfolio status/);
    assert.match(report, /5 Now \/ 4 Next \/ 2 Later/);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
