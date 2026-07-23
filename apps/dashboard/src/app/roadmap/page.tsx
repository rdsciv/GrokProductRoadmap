import { FilterBar } from "@/components/FilterBar";
import { pillarLabels, RoadmapBoard } from "@/components/RoadmapBoard";
import { getRoadmapItems } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Params = Record<string, string | string[] | undefined>;
const value = (input: string | string[] | undefined) =>
  typeof input === "string" ? input : undefined;

export default async function RoadmapPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const pillar = value(params.pillar);
  const horizon = value(params.horizon);
  const confidence = value(params.confidence);
  const owner = value(params.owner);
  const allItems = getRoadmapItems();
  const items = allItems.filter(
    (item) =>
      (!pillar || item.productPillar === pillar) &&
      (!horizon || item.horizon === horizon) &&
      (!confidence || item.confidence === confidence) &&
      (!owner || item.ownerTeam === owner),
  );

  return (
    <>
      <header className="page-header">
        <div>
          <div className="eyebrow">Proposed strategy</div>
          <h1>Grok suite roadmap</h1>
          <p className="subtitle">
            An optimistic sequencing view for portfolio decisions. Horizons express direction, not delivery commitments.
          </p>
        </div>
        <div className="truth-label"><span className="truth-dot" /> {items.length} of {allItems.length} recommendations</div>
      </header>

      <FilterBar
        selects={[
          {
            name: "pillar",
            label: "Product pillar",
            value: pillar,
            options: Object.entries(pillarLabels).map(([optionValue, label]) => ({ value: optionValue, label })),
          },
          {
            name: "horizon",
            label: "Horizon",
            value: horizon,
            options: [
              { value: "now", label: "Now" },
              { value: "next", label: "Next" },
              { value: "later", label: "Later" },
            ],
          },
          {
            name: "confidence",
            label: "Confidence",
            value: confidence,
            options: [
              { value: "high", label: "High" },
              { value: "medium", label: "Medium" },
              { value: "low", label: "Low" },
            ],
          },
          {
            name: "owner",
            label: "Owner",
            value: owner,
            options: [...new Set(allItems.map((item) => item.ownerTeam))]
              .sort()
              .map((optionValue) => ({ value: optionValue, label: optionValue })),
          },
        ]}
      />
      <RoadmapBoard items={items} detailed />
    </>
  );
}
