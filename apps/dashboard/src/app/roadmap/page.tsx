import { FilterBar } from "@/components/FilterBar";
import { pillarLabels, RoadmapBoard } from "@/components/RoadmapBoard";
import { getRoadmapItems } from "@/lib/data";

export default function RoadmapPage() {
  const items = getRoadmapItems();

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
        <div className="truth-label"><span className="truth-dot" /> <span data-filter-count="roadmap">{items.length} of {items.length}</span> recommendations</div>
      </header>

      <FilterBar
        scope="roadmap"
        selects={[
          {
            name: "pillar",
            label: "Product pillar",
            options: Object.entries(pillarLabels).map(([optionValue, label]) => ({ value: optionValue, label })),
          },
          {
            name: "horizon",
            label: "Horizon",
            options: [
              { value: "now", label: "Now" },
              { value: "next", label: "Next" },
              { value: "later", label: "Later" },
            ],
          },
          {
            name: "confidence",
            label: "Confidence",
            options: [
              { value: "high", label: "High" },
              { value: "medium", label: "Medium" },
              { value: "low", label: "Low" },
            ],
          },
          {
            name: "owner",
            label: "Owner",
            options: [...new Set(items.map((item) => item.ownerTeam))]
              .sort()
              .map((optionValue) => ({ value: optionValue, label: optionValue })),
          },
        ]}
      />
      <RoadmapBoard items={items} detailed />
      <div className="empty-state" data-filter-empty="roadmap" hidden>No roadmap recommendations match these filters.</div>
    </>
  );
}
