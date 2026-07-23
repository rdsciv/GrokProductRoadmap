import type { RoadmapItem } from "@fft/db";

export const pillarLabels = {
  core_api: "Core + API",
  work: "Work",
  build: "Build",
  imagine: "Imagine",
  enterprise: "Enterprise",
  ecosystem: "Ecosystem",
} as const;

export const horizonLabels = {
  now: "Now",
  next: "Next",
  later: "Later",
} as const;

export function RoadmapBoard({
  items,
  detailed = false,
}: {
  items: RoadmapItem[];
  detailed?: boolean;
}) {
  const pillars = Object.keys(pillarLabels) as Array<keyof typeof pillarLabels>;
  const horizons = Object.keys(horizonLabels) as Array<keyof typeof horizonLabels>;

  if (items.length === 0) {
    return <div className="empty-state">No roadmap recommendations match these filters.</div>;
  }

  return (
    <div className="roadmap-board" aria-label="Proposed suite roadmap">
      <div className="roadmap-corner">Product suite</div>
      {horizons.map((horizon) => (
        <div className={`roadmap-heading horizon-${horizon}`} key={horizon}>
          {horizonLabels[horizon]}
          <span>{items.filter((item) => item.horizon === horizon).length}</span>
        </div>
      ))}
      {pillars.map((pillar) => {
        const pillarItems = items.filter((item) => item.productPillar === pillar);
        if (pillarItems.length === 0) return null;
        return (
          <div className="roadmap-row" key={pillar}>
            <div className="roadmap-pillar">
              <span className={`pillar-dot pillar-${pillar}`} />
              {pillarLabels[pillar]}
            </div>
            {horizons.map((horizon) => (
              <div className="roadmap-cell" data-horizon={horizon} key={horizon}>
                <div className="mobile-horizon">{horizonLabels[horizon]}</div>
                {pillarItems
                  .filter((item) => item.horizon === horizon)
                  .map((item) => (
                    <article
                      className="roadmap-item"
                      data-filter-scope="roadmap"
                      data-pillar={item.productPillar}
                      data-horizon={item.horizon}
                      data-confidence={item.confidence}
                      data-owner={item.ownerTeam}
                      data-search={`${item.title} ${item.summary} ${item.desiredOutcome}`.toLowerCase()}
                      key={item.id}
                    >
                      <div className="roadmap-item-meta">
                        <span className={`confidence confidence-${item.confidence}`}>
                          {item.confidence} confidence
                        </span>
                        <span>{item.ownerTeam}</span>
                      </div>
                      <h3>{item.title}</h3>
                      <p>{item.summary}</p>
                      {detailed ? (
                        <details>
                          <summary>Outcome and signals</summary>
                          <p className="desired-outcome">{item.desiredOutcome}</p>
                          <ul>
                            {item.successSignals.map((signal) => (
                              <li key={signal}>{signal}</li>
                            ))}
                          </ul>
                          {item.dependencies.length > 0 ? (
                            <p className="dependencies">
                              <strong>Depends on:</strong> {item.dependencies.join(" · ")}
                            </p>
                          ) : null}
                        </details>
                      ) : null}
                    </article>
                  ))}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
