import { PriorityBadge } from "@/components/Badges";
import { FilterBar } from "@/components/FilterBar";
import { getGaps } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Params = Record<string, string | string[] | undefined>;
const value = (input: string | string[] | undefined) => typeof input === "string" ? input : "";

export default async function GapsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const q = value(params.q).toLowerCase();
  const priority = value(params.priority);
  const status = value(params.status);
  const owner = value(params.owner);
  const grokStatus = value(params.grokStatus);
  const allGaps = getGaps();
  const gaps = allGaps.filter((gap) =>
    (!q || `${gap.title} ${gap.description} ${gap.recommendedAction}`.toLowerCase().includes(q)) &&
    (!priority || gap.priority === priority) &&
    (!status || gap.status === status) &&
    (!owner || gap.ownerTeam === owner) &&
    (!grokStatus || gap.grokStatus === grokStatus));

  return (
    <>
      <h1>Gap analysis board</h1>
      <p className="subtitle">
        Explicit Grok / xAI competitive gaps with priority scoring. Formula: 0.4×revenue + 0.3×demand
        + 0.3×urgency (1–5 each).
      </p>

      <FilterBar
        search={{ value: value(params.q), placeholder: "Search gaps and recommended actions" }}
        selects={[
          { name: "priority", label: "Priority", value: priority, options: [
            { value: "high", label: "High" }, { value: "medium", label: "Medium" }, { value: "low", label: "Low" },
          ] },
          { name: "status", label: "Status", value: status, options: [...new Set(allGaps.map((gap) => gap.status))].sort().map((option) => ({ value: option, label: option })) },
          { name: "owner", label: "Owner", value: owner, options: [...new Set(allGaps.map((gap) => gap.ownerTeam))].sort().map((option) => ({ value: option, label: option })) },
          { name: "grokStatus", label: "Grok status", value: grokStatus, options: [...new Set(allGaps.map((gap) => gap.grokStatus))].sort().map((option) => ({ value: option, label: option })) },
        ]}
      />

      <div className="stack">
        {gaps.length === 0 ? <div className="empty-state">No gaps match these filters.</div> : null}
        {gaps.map((g) => (
          <article key={g.id} className="card gap-card">
            <div className="gap-meta">
              <PriorityBadge priority={g.priority} />
              <span className="badge badge-info">{g.status}</span>
              <span className="tag">{g.ownerTeam}</span>
              <span className="tag">grok: {g.grokStatus}</span>
              {g.seeded ? <span className="tag">seeded baseline</span> : null}
            </div>
            <h3>{g.title}</h3>
            <p style={{ margin: "0 0 0.5rem" }}>{g.description}</p>
            <div className="score-bar">
              <span>Score <strong style={{ color: "var(--text)" }}>{g.priorityScore}</strong></span>
              <span>Revenue {g.revenueImpact}/5</span>
              <span>Demand {g.userDemand}/5</span>
              <span>Urgency {g.competitiveUrgency}/5</span>
            </div>
            {g.competitorExamples.length > 0 ? (
              <div style={{ marginTop: "0.35rem" }}>
                <span className="muted" style={{ fontSize: "0.8rem" }}>
                  Competitor proof points:{" "}
                </span>
                {g.competitorExamples.map((ex) => (
                  <span key={ex} className="tag">
                    {ex}
                  </span>
                ))}
              </div>
            ) : null}
            <div className="action">
              <strong style={{ color: "var(--text)" }}>Recommended: </strong>
              {g.recommendedAction}
            </div>
            {g.sourceUrls.length > 0 ? (
              <div style={{ marginTop: "0.5rem", fontSize: "0.8rem" }}>
                Sources:{" "}
                {g.sourceUrls.map((u) => (
                  <a key={u} href={u} target="_blank" rel="noreferrer" style={{ marginRight: "0.5rem" }}>
                    {new URL(u).hostname}
                  </a>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </>
  );
}
