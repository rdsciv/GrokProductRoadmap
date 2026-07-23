# Grok Product Roadmap

**A source-backed competitive intelligence and portfolio-planning dashboard for the Grok product suite.**

It tracks Western and Chinese frontier models, product surfaces, financial signals, and explicit Grok gaps, then turns that evidence into a Director-level **Now / Next / Later roadmap**.

[![Deploy GitHub Pages](https://github.com/rdsciv/GrokProductRoadmap/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/rdsciv/GrokProductRoadmap/actions/workflows/deploy-pages.yml)

## Live dashboard

**https://rdsciv.github.io/GrokProductRoadmap/**

The public site is a fully static Next.js export. No database or server is required at runtime.

## What it answers

- Where Grok has a genuine product or distribution gap—and where it does not.
- Which gaps have the strongest revenue, demand, and competitive urgency.
- How the suite should sequence Core + API, Work, Build, Imagine, Enterprise, and Ecosystem bets.
- Which model releases, Chinese open-weight moves, and financial signals should change priorities.
- What evidence supports each recommendation and where known evidence debt remains.

## Dashboard views

| View | Purpose |
|---|---|
| **Command Center** | Portfolio roadmap, leadership queue, competitor coverage, and critical signals |
| **Roadmap** | Proposed Now / Next / Later initiatives across six Grok product pillars |
| **Feature Matrix** | Companies × capabilities with Grok as the primary comparison lens |
| **Gaps** | Scored gaps with recommended actions and source links |
| **Opportunities** | Market-share moves connected to gaps and financial signals |
| **Timeline** | Model releases and competitive events with capability deltas |
| **Chinese Velocity** | DeepSeek, Kimi, Qwen, GLM, MiniMax, and ByteDance tracking |
| **Financial** | ARR estimates, partner commitments, acquisitions, and reliability labels |
| **Products** | Desktop, coding, hardware, partners, education, and enterprise surfaces |
| **Sources** | Monitored official pages and local collector status |

Roadmap entries are strategic recommendations, not delivery commitments. Horizons intentionally avoid unsupported date precision.

## Quick start

Requires Node.js 22 or later.

```bash
git clone https://github.com/rdsciv/GrokProductRoadmap.git
cd GrokProductRoadmap
npm install
npm run dev
```

Open http://localhost:3456.

Useful commands:

```bash
npm run export-data      # YAML seed → static dashboard snapshot
npm run seed             # YAML seed → local SQLite database
npm run collect          # hash-monitor configured sources
npm run report:baseline
npm run report:weekly
npm run check            # validation, tests, types, and production build
npm run build:pages      # production export with the Pages base path
```

Collectors run in proposal mode: they record scrape runs and events, but never auto-edit the curated matrix, gaps, or roadmap.

## Data model and governance

| Layer | Role |
|---|---|
| `data/seed/baseline-2026-07.yaml` | Curated, reviewable source of truth |
| `data/sources.yaml` | URLs and collection cadence |
| `scripts/export-static-data.ts` | Produces the static dashboard snapshot |
| `apps/dashboard/src/data/tracker.json` | Generated build-time data for GitHub Pages |
| `data/tracker.db` | Optional local SQLite database; gitignored |
| `data/evidence-debt.json` | Known unsourced claims that may shrink but cannot grow |
| `reports/` | Baseline, weekly, and primary-source research reports |

Data rules:

1. Edit curated truth in YAML, then regenerate the snapshot.
2. Require source URLs and as-of awareness for factual claims.
3. Mark estimates with `isEstimate` and a reliability level.
4. Prefer official primary sources over secondary coverage.
5. Be fair to Grok: enterprise SSO/SCIM exist; key gaps are packaging, desktop, channel, visibility, and Cursor migration.

### Priority scoring

```text
priority score = 0.4 × revenue impact
               + 0.3 × user demand
               + 0.3 × competitive urgency
```

Each component is scored from 1–5. **High ≥ 3.5**, **Medium ≥ 2.5**, otherwise **Low**.

## Architecture

```text
apps/dashboard/       Next.js 15 static analyst dashboard
packages/schema/      Zod schemas, relationships, and priority scoring
packages/db/          Optional SQLite schema, queries, and atomic seed loader
packages/collectors/  HTTP change detection in proposal mode
data/seed/            Git-versioned curated baseline YAML
scripts/              Static export, validation, and report generation
reports/              Baseline, weekly, and research artifacts
.github/workflows/    CI and GitHub Pages deployment
```

The Pages workflow runs the full project check, builds with a repository-derived base path, uploads `apps/dashboard/out`, and deploys on every push to `main`.

## Contributing

1. Edit `data/seed/baseline-2026-07.yaml` or add a new dated seed.
2. Add sources and reliability labels for new claims.
3. Run `npm run export-data` and inspect the dashboard.
4. Run `npm run check` before opening a pull request.
5. Regenerate baseline or weekly reports when the curated dataset changes materially.

## Disclaimer

This repository is for research and product strategy. ARR figures and some capability claims are press-reported estimates unless marked official; re-verify primary sources before executive or investment decisions. Third-party trademarks belong to their respective owners.
