import tracker from "@/data/tracker.json";

export type Company = (typeof tracker.companies)[number];
export type Model = (typeof tracker.models)[number];
export type Product = (typeof tracker.products)[number];
export type Feature = (typeof tracker.features)[number];
export type MatrixCell = (typeof tracker.matrix)[number];
export type Gap = (typeof tracker.gaps)[number];
export type Opportunity = (typeof tracker.opportunities)[number];
export type RoadmapItem = (typeof tracker.roadmapItems)[number];
export type FinancialSignal = (typeof tracker.financialSignals)[number];
export type Event = (typeof tracker.events)[number];
export type Source = (typeof tracker.sources)[number];

const companyById = new Map(tracker.companies.map((c) => [c.id, c]));

export function getMeta() {
  return {
    baseline_date: tracker.baselineDate,
    as_of: tracker.asOf,
    seeded_at: tracker.exportedAt,
  };
}

export function getCompanies() {
  return [...tracker.companies].sort((a, b) => a.name.localeCompare(b.name));
}

export function getModels() {
  return [...tracker.models]
    .map((model) => {
      const company = companyById.get(model.companyId);
      return {
        model,
        companyName: company?.name ?? null,
        companyRegion: company?.region ?? null,
      };
    })
    .sort((a, b) => (b.model.releaseDate ?? "").localeCompare(a.model.releaseDate ?? ""));
}

export function getProducts() {
  return [...tracker.products]
    .map((product) => ({
      product,
      companyName: companyById.get(product.companyId)?.name ?? null,
    }))
    .sort((a, b) => a.product.name.localeCompare(b.product.name));
}

export function getFeatures() {
  return [...tracker.features].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export function getMatrix() {
  return tracker.matrix;
}

export function getGaps() {
  return [...tracker.gaps].sort((a, b) => b.priorityScore - a.priorityScore);
}

export function getOpportunities() {
  const order = { high: 0, medium: 1, low: 2 } as Record<string, number>;
  return [...tracker.opportunities].sort(
    (a, b) => (order[a.urgency] ?? 9) - (order[b.urgency] ?? 9),
  );
}

const horizonOrder: Record<string, number> = { now: 0, next: 1, later: 2 };
const pillarOrder = {
  core_api: 0,
  work: 1,
  build: 2,
  imagine: 3,
  enterprise: 4,
  ecosystem: 5,
} as Record<string, number>;

export function getRoadmapItems() {
  return [...tracker.roadmapItems].sort(
    (a, b) =>
      (horizonOrder[a.horizon] ?? 9) - (horizonOrder[b.horizon] ?? 9) ||
      (pillarOrder[a.productPillar] ?? 9) - (pillarOrder[b.productPillar] ?? 9) ||
      a.title.localeCompare(b.title),
  );
}

export function getPortfolioSummary() {
  const roadmap = getRoadmapItems();
  const activeGaps = getGaps().filter(
    (gap) => gap.status !== "won" && gap.status !== "wontfix",
  );
  return {
    roadmapItems: roadmap.length,
    now: roadmap.filter((item) => item.horizon === "now").length,
    next: roadmap.filter((item) => item.horizon === "next").length,
    later: roadmap.filter((item) => item.horizon === "later").length,
    highConfidence: roadmap.filter((item) => item.confidence === "high").length,
    highGaps: activeGaps.filter((gap) => gap.priority === "high").length,
    pillars: new Set(roadmap.map((item) => item.productPillar)).size,
  };
}

export function getCompetitiveCoverage() {
  return tracker.companies
    .filter((company) => company.isCore)
    .map((company) => {
      const cells = tracker.matrix.filter((cell) => cell.companyId === company.id);
      const full = cells.filter(
        (cell) => cell.supportLevel === "full" || cell.supportLevel === "superior",
      ).length;
      const partial = cells.filter((cell) => cell.supportLevel === "partial").length;
      const missing = cells.filter((cell) => cell.supportLevel === "none").length;
      const unknown = cells.filter((cell) => cell.supportLevel === "unknown").length;
      const known = full + partial + missing;
      return {
        companyId: company.id,
        companyName: company.name,
        region: company.region,
        full,
        partial,
        missing,
        unknown,
        knownCoveragePercent:
          known === 0 ? 0 : Math.round(((full + partial * 0.5) / known) * 100),
      };
    })
    .sort((a, b) => b.full - a.full || b.partial - a.partial || a.companyName.localeCompare(b.companyName));
}

export function getFinancialSignals() {
  return tracker.financialSignals.map((signal) => ({
    signal,
    companyName: signal.companyId
      ? (companyById.get(signal.companyId)?.name ?? null)
      : null,
  }));
}

export function getEvents(limit = 50) {
  return [...tracker.events]
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    .slice(0, limit)
    .map((event) => ({
      event,
      companyName: event.companyId
        ? (companyById.get(event.companyId)?.name ?? null)
        : null,
    }));
}

export function getSources() {
  return [...tracker.sources].sort((a, b) => a.name.localeCompare(b.name));
}

export function getChineseModels() {
  return getModels().filter((m) => m.companyRegion === "chinese");
}

export function getStats() {
  const gaps = tracker.gaps;
  return {
    companies: tracker.companies.length,
    models: tracker.models.length,
    products: tracker.products.length,
    gaps: gaps.length,
    highGaps: gaps.filter((g) => g.priority === "high").length,
    opportunities: tracker.opportunities.length,
    roadmapItems: tracker.roadmapItems.length,
    events: tracker.events.length,
    sources: tracker.sources.length,
  };
}
