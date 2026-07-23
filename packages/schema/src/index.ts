import { z } from "zod";

export const EntityIdSchema = z
  .string()
  .regex(/^[a-z0-9][a-z0-9-]*$/, "IDs must be lowercase URL-safe slugs");

// ── Enums ──────────────────────────────────────────────────────────────────

export const RegionSchema = z.enum(["western", "chinese", "other"]);
export type Region = z.infer<typeof RegionSchema>;

export const CompanyTypeSchema = z.enum(["lab", "cloud", "platform", "hardware", "other"]);
export type CompanyType = z.infer<typeof CompanyTypeSchema>;

export const ModelStatusSchema = z.enum(["preview", "ga", "deprecated", "rumored"]);
export type ModelStatus = z.infer<typeof ModelStatusSchema>;

export const ProductCategorySchema = z.enum([
  "desktop_work",
  "mobile",
  "web",
  "cli",
  "browser_ext",
  "ide",
  "hardware",
  "cloud_agent",
  "education",
  "partner_network",
  "enterprise",
  "api",
  "multimodal",
  "other",
]);
export type ProductCategory = z.infer<typeof ProductCategorySchema>;

export const FeatureCategorySchema = z.enum([
  "agentic",
  "coding",
  "multimodal",
  "enterprise",
  "ecosystem",
  "distribution",
  "desktop",
  "pricing",
  "other",
]);
export type FeatureCategory = z.infer<typeof FeatureCategorySchema>;

export const SupportLevelSchema = z.enum([
  "none",
  "partial",
  "full",
  "unknown",
  "superior",
]);
export type SupportLevel = z.infer<typeof SupportLevelSchema>;

export const GrokStatusSchema = z.enum(["missing", "partial", "shipping", "closed"]);
export type GrokStatus = z.infer<typeof GrokStatusSchema>;

export const PrioritySchema = z.enum(["high", "medium", "low"]);
export type Priority = z.infer<typeof PrioritySchema>;

export const GapStatusSchema = z.enum([
  "open",
  "watching",
  "in_progress",
  "won",
  "wontfix",
]);
export type GapStatus = z.infer<typeof GapStatusSchema>;

export const OwnerTeamSchema = z.enum([
  "product",
  "gtm",
  "eng",
  "leadership",
  "partnerships",
  "marketing",
]);
export type OwnerTeam = z.infer<typeof OwnerTeamSchema>;

export const SignalTypeSchema = z.enum([
  "earnings_commentary",
  "arr_estimate",
  "usage_share",
  "cloud_growth",
  "funding",
  "acquisition",
  "other",
]);
export type SignalType = z.infer<typeof SignalTypeSchema>;

export const SourceReliabilitySchema = z.enum([
  "official",
  "reputable_press",
  "estimate",
  "rumor",
]);
export type SourceReliability = z.infer<typeof SourceReliabilitySchema>;

export const EventTypeSchema = z.enum([
  "model_release",
  "pricing_change",
  "product_launch",
  "partner_program",
  "hardware",
  "earnings",
  "acquisition",
  "other",
]);
export type EventType = z.infer<typeof EventTypeSchema>;

export const SeveritySchema = z.enum(["info", "notable", "critical"]);
export type Severity = z.infer<typeof SeveritySchema>;

export const ModalitySchema = z.enum([
  "text",
  "image",
  "video",
  "audio",
  "tools",
  "computer_use",
]);
export type Modality = z.infer<typeof ModalitySchema>;

export const ProductPillarSchema = z.enum([
  "core_api",
  "work",
  "build",
  "imagine",
  "enterprise",
  "ecosystem",
]);
export type ProductPillar = z.infer<typeof ProductPillarSchema>;

export const RoadmapHorizonSchema = z.enum(["now", "next", "later"]);
export type RoadmapHorizon = z.infer<typeof RoadmapHorizonSchema>;

export const ConfidenceSchema = z.enum(["high", "medium", "low"]);
export type Confidence = z.infer<typeof ConfidenceSchema>;

// ── Scoring ────────────────────────────────────────────────────────────────

export const SCORING_WEIGHTS = {
  revenueImpact: 0.4,
  userDemand: 0.3,
  competitiveUrgency: 0.3,
} as const;

export function computePriorityScore(
  revenueImpact: number,
  userDemand: number,
  competitiveUrgency: number,
): number {
  const score =
    SCORING_WEIGHTS.revenueImpact * revenueImpact +
    SCORING_WEIGHTS.userDemand * userDemand +
    SCORING_WEIGHTS.competitiveUrgency * competitiveUrgency;
  return Math.round(score * 100) / 100;
}

export function priorityFromScore(score: number): Priority {
  if (score >= 3.5) return "high";
  if (score >= 2.5) return "medium";
  return "low";
}

// ── Seed schemas ───────────────────────────────────────────────────────────

export const CompanySeedSchema = z.object({
  id: EntityIdSchema,
  name: z.string().min(1),
  region: RegionSchema,
  type: CompanyTypeSchema,
  website: z.string().url().optional(),
  notes: z.string().optional(),
  isCore: z.boolean().default(true),
});
export type CompanySeed = z.infer<typeof CompanySeedSchema>;

export const ModelSeedSchema = z.object({
  id: EntityIdSchema,
  companyId: EntityIdSchema,
  name: z.string().min(1),
  slug: z.string().min(1),
  releaseDate: z.string().optional(),
  status: ModelStatusSchema.default("ga"),
  paramsTotal: z.string().optional(),
  paramsActive: z.string().optional(),
  moe: z.boolean().optional(),
  contextWindow: z.string().optional(),
  modalities: z.array(ModalitySchema).default(["text"]),
  openWeights: z.boolean().default(false),
  license: z.string().optional(),
  apiInputPerM: z.number().optional(),
  apiOutputPerM: z.number().optional(),
  consumerPlans: z.string().optional(),
  benchmarks: z.record(z.union([z.string(), z.number()])).optional(),
  capabilityDelta: z.string().optional(),
  sourceUrls: z.array(z.string().url()).default([]),
  lastVerifiedAt: z.string().optional(),
  notes: z.string().optional(),
});
export type ModelSeed = z.infer<typeof ModelSeedSchema>;

export const ProductSeedSchema = z.object({
  id: EntityIdSchema,
  companyId: EntityIdSchema,
  name: z.string().min(1),
  category: ProductCategorySchema,
  description: z.string().optional(),
  platforms: z.array(z.string()).default([]),
  pricingNotes: z.string().optional(),
  launchDate: z.string().optional(),
  status: z.string().default("ga"),
  sourceUrls: z.array(z.string().url()).default([]),
  notes: z.string().optional(),
});
export type ProductSeed = z.infer<typeof ProductSeedSchema>;

export const FeatureSeedSchema = z.object({
  id: EntityIdSchema,
  slug: z.string().min(1),
  name: z.string().min(1),
  category: FeatureCategorySchema,
  description: z.string().optional(),
  sortOrder: z.number().default(0),
});
export type FeatureSeed = z.infer<typeof FeatureSeedSchema>;

export const MatrixCellSeedSchema = z.object({
  companyId: EntityIdSchema,
  featureId: EntityIdSchema,
  supportLevel: SupportLevelSchema,
  notes: z.string().optional(),
  evidenceUrl: z.string().url().optional(),
  asOf: z.string().optional(),
});
export type MatrixCellSeed = z.infer<typeof MatrixCellSeedSchema>;

export const GapSeedSchema = z.object({
  id: EntityIdSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  competitorExamples: z.array(z.string()).default([]),
  grokStatus: GrokStatusSchema,
  revenueImpact: z.number().min(1).max(5),
  userDemand: z.number().min(1).max(5),
  competitiveUrgency: z.number().min(1).max(5),
  recommendedAction: z.string().min(1),
  ownerTeam: OwnerTeamSchema,
  status: GapStatusSchema.default("open"),
  seeded: z.boolean().default(true),
  sourceUrls: z.array(z.string().url()).default([]),
});
export type GapSeed = z.infer<typeof GapSeedSchema>;

export const OpportunitySeedSchema = z.object({
  id: EntityIdSchema,
  title: z.string().min(1),
  description: z.string().optional(),
  linkedGapIds: z.array(EntityIdSchema).default([]),
  linkedFinancialSignalIds: z.array(EntityIdSchema).default([]),
  marketCategory: z.string().optional(),
  estimatedTamNotes: z.string().optional(),
  recommendedMove: z.string().min(1),
  urgency: PrioritySchema,
  status: z.string().default("open"),
});
export type OpportunitySeed = z.infer<typeof OpportunitySeedSchema>;

export const FinancialSignalSeedSchema = z.object({
  id: EntityIdSchema,
  companyId: EntityIdSchema.optional(),
  signalType: SignalTypeSchema,
  period: z.string().optional(),
  metricName: z.string().min(1),
  metricValue: z.string().optional(),
  unit: z.string().optional(),
  isEstimate: z.boolean().default(false),
  quote: z.string().optional(),
  sourceUrl: z.string().url().optional(),
  sourceReliability: SourceReliabilitySchema.default("reputable_press"),
  asOf: z.string().optional(),
  implicationForGrok: z.string().optional(),
});
export type FinancialSignalSeed = z.infer<typeof FinancialSignalSeedSchema>;

export const EventSeedSchema = z.object({
  id: EntityIdSchema,
  eventType: EventTypeSchema,
  companyId: EntityIdSchema.optional(),
  title: z.string().min(1),
  summary: z.string().optional(),
  occurredAt: z.string().min(1),
  sourceUrl: z.string().url().optional(),
  severity: SeveritySchema.default("info"),
  tags: z.array(z.string()).default([]),
});
export type EventSeed = z.infer<typeof EventSeedSchema>;

export const RoadmapItemSeedSchema = z.object({
  id: EntityIdSchema,
  title: z.string().min(1),
  summary: z.string().min(1),
  productPillar: ProductPillarSchema,
  horizon: RoadmapHorizonSchema,
  confidence: ConfidenceSchema,
  ownerTeam: OwnerTeamSchema,
  desiredOutcome: z.string().min(1),
  successSignals: z.array(z.string().min(1)).min(1),
  linkedGapIds: z.array(EntityIdSchema).default([]),
  linkedOpportunityIds: z.array(EntityIdSchema).default([]),
  dependencies: z.array(z.string().min(1)).default([]),
  rationale: z.string().min(1),
  sourceUrls: z.array(z.string().url()).default([]),
});
export type RoadmapItemSeed = z.infer<typeof RoadmapItemSeedSchema>;

export const SourceConfigSchema = z.object({
  id: EntityIdSchema,
  companyId: EntityIdSchema.optional(),
  name: z.string().min(1),
  url: z.string().url(),
  sourceType: z.string().min(1),
  cadence: z.enum(["realtime", "daily", "weekly", "quarterly"]).default("daily"),
  enabled: z.boolean().default(true),
  notes: z.string().optional(),
});
export type SourceConfig = z.infer<typeof SourceConfigSchema>;

export const SourcesDocumentSchema = z.object({
  sources: z.array(SourceConfigSchema),
});
export type SourcesDocument = z.infer<typeof SourcesDocumentSchema>;

export const TrackerSeedSchema = z.object({
  baselineDate: z.string(),
  asOf: z.string(),
  companies: z.array(CompanySeedSchema),
  models: z.array(ModelSeedSchema),
  products: z.array(ProductSeedSchema),
  features: z.array(FeatureSeedSchema),
  matrix: z.array(MatrixCellSeedSchema),
  gaps: z.array(GapSeedSchema),
  opportunities: z.array(OpportunitySeedSchema),
  financialSignals: z.array(FinancialSignalSeedSchema),
  events: z.array(EventSeedSchema),
  roadmapItems: z.array(RoadmapItemSeedSchema).default([]),
});
export type TrackerSeed = z.infer<typeof TrackerSeedSchema>;

export type DataValidationResult = {
  errors: string[];
  warnings: string[];
  missingEvidence: string[];
};

export function validateTrackerData(
  seed: TrackerSeed,
  sourcesDocument: SourcesDocument,
  allowedMissingEvidence: readonly string[] = [],
): DataValidationResult {
  const errors: string[] = [];
  const allowed = new Set(allowedMissingEvidence);
  const companyIds = new Set(seed.companies.map((item) => item.id));
  const featureIds = new Set(seed.features.map((item) => item.id));
  const gapIds = new Set(seed.gaps.map((item) => item.id));
  const opportunityIds = new Set(seed.opportunities.map((item) => item.id));
  const financialIds = new Set(seed.financialSignals.map((item) => item.id));

  const checkDuplicates = (label: string, ids: string[]) => {
    const seen = new Set<string>();
    for (const id of ids) {
      if (seen.has(id)) errors.push(`Duplicate ${label} ID: ${id}`);
      seen.add(id);
    }
  };

  for (const [label, items] of Object.entries({
    company: seed.companies,
    model: seed.models,
    product: seed.products,
    feature: seed.features,
    gap: seed.gaps,
    opportunity: seed.opportunities,
    financial: seed.financialSignals,
    event: seed.events,
    roadmap: seed.roadmapItems,
    source: sourcesDocument.sources,
  })) {
    checkDuplicates(label, items.map((item) => item.id));
  }
  checkDuplicates(
    "matrix cell",
    seed.matrix.map((cell) => `${cell.companyId}:${cell.featureId}`),
  );

  const requireRef = (kind: string, owner: string, id: string, valid: Set<string>) => {
    if (!valid.has(id)) errors.push(`${owner} references missing ${kind}: ${id}`);
  };
  for (const model of seed.models) requireRef("company", `model:${model.id}`, model.companyId, companyIds);
  for (const product of seed.products) requireRef("company", `product:${product.id}`, product.companyId, companyIds);
  for (const cell of seed.matrix) {
    requireRef("company", `matrix:${cell.companyId}:${cell.featureId}`, cell.companyId, companyIds);
    requireRef("feature", `matrix:${cell.companyId}:${cell.featureId}`, cell.featureId, featureIds);
  }
  for (const signal of seed.financialSignals) {
    if (signal.companyId) requireRef("company", `financial:${signal.id}`, signal.companyId, companyIds);
  }
  for (const event of seed.events) {
    if (event.companyId) requireRef("company", `event:${event.id}`, event.companyId, companyIds);
  }
  for (const source of sourcesDocument.sources) {
    if (source.companyId) requireRef("company", `source:${source.id}`, source.companyId, companyIds);
  }
  for (const opportunity of seed.opportunities) {
    for (const id of opportunity.linkedGapIds) requireRef("gap", `opportunity:${opportunity.id}`, id, gapIds);
    for (const id of opportunity.linkedFinancialSignalIds) {
      requireRef("financial signal", `opportunity:${opportunity.id}`, id, financialIds);
    }
  }
  for (const item of seed.roadmapItems) {
    for (const id of item.linkedGapIds) requireRef("gap", `roadmap:${item.id}`, id, gapIds);
    for (const id of item.linkedOpportunityIds) {
      requireRef("opportunity", `roadmap:${item.id}`, id, opportunityIds);
    }
  }

  const missingEvidence = [
    ...seed.models.filter((item) => item.sourceUrls.length === 0).map((item) => `model:${item.id}`),
    ...seed.products.filter((item) => item.sourceUrls.length === 0).map((item) => `product:${item.id}`),
    ...seed.gaps.filter((item) => item.sourceUrls.length === 0).map((item) => `gap:${item.id}`),
    ...seed.matrix.filter((item) => !item.evidenceUrl).map((item) => `matrix:${item.companyId}:${item.featureId}`),
    ...seed.financialSignals.filter((item) => !item.sourceUrl).map((item) => `financial:${item.id}`),
    ...seed.events.filter((item) => !item.sourceUrl).map((item) => `event:${item.id}`),
  ].sort();
  const newDebt = missingEvidence.filter((key) => !allowed.has(key));
  for (const key of newDebt) errors.push(`New claim is missing evidence: ${key}`);

  return {
    errors,
    warnings: missingEvidence
      .filter((key) => allowed.has(key))
      .map((key) => `Existing evidence debt: ${key}`),
    missingEvidence,
  };
}
