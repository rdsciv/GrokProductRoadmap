import { SeverityBadge } from "@/components/Badges";
import { FilterBar } from "@/components/FilterBar";
import { getEvents, getModels } from "@/lib/queries";

export default function TimelinePage() {
  const events = getEvents(100);
  const models = getModels().filter((item) => item.model.releaseDate);

  return (
    <>
      <h1>Release & competitive timeline</h1>
      <p className="subtitle">
        Chronological model releases and competitive events with capability deltas.
      </p>

      <FilterBar
        scope="timeline"
        search={{ placeholder: "Search launches and capability deltas" }}
        selects={[
          { name: "eventType", label: "Event type", options: [...new Set(events.map(({ event }) => event.eventType))].sort().map((option) => ({ value: option, label: option.replaceAll("_", " ") })) },
          { name: "severity", label: "Severity", options: [
            { value: "critical", label: "Critical" }, { value: "notable", label: "Notable" }, { value: "info", label: "Info" },
          ] },
          { name: "company", label: "Company", options: [...new Map(events.filter(({ event }) => event.companyId).map(({ event, companyName }) => [event.companyId!, companyName ?? event.companyId!])).entries()].map(([optionValue, label]) => ({ value: optionValue, label })) },
        ]}
      />
      <div className="empty-state" data-filter-empty="timeline" hidden>No timeline entries match these filters.</div>

      <div className="grid grid-2">
        <section>
          <h2>Events</h2>
          <div className="card" style={{ padding: "0.5rem 1rem" }}>
            {events.map(({ event, companyName }) => (
              <div
                key={event.id}
                className="timeline-item"
                data-filter-scope="timeline"
                data-event-type={event.eventType}
                data-severity={event.severity}
                data-company={event.companyId ?? ""}
                data-search={`${event.title} ${event.summary ?? ""} ${companyName ?? ""}`.toLowerCase()}
              >
                <div className="timeline-date">{event.occurredAt}</div>
                <div>
                  <SeverityBadge severity={event.severity} />{" "}
                  <span className="tag">{event.eventType}</span>
                  <div style={{ marginTop: "0.25rem" }}>
                    <strong>{event.title}</strong>
                  </div>
                  <div className="muted" style={{ fontSize: "0.85rem" }}>
                    {companyName ?? "Industry"}
                    {event.summary ? ` — ${event.summary}` : ""}
                  </div>
                  {event.sourceUrl ? (
                    <a href={event.sourceUrl} target="_blank" rel="noreferrer" style={{ fontSize: "0.8rem" }}>
                      Source
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>Model releases</h2>
          <div className="card" style={{ padding: "0.5rem 1rem" }}>
            {models.map(({ model, companyName, companyRegion }) => (
              <div
                key={model.id}
                className="timeline-item"
                data-filter-scope="timeline"
                data-company={model.companyId}
                data-search={`${model.name} ${model.capabilityDelta ?? ""} ${companyName ?? ""}`.toLowerCase()}
              >
                <div className="timeline-date">{model.releaseDate}</div>
                <div>
                  <strong>{model.name}</strong>{" "}
                  <span className="muted">
                    {companyName} · {companyRegion}
                  </span>
                  {model.openWeights ? <span className="tag">open</span> : <span className="tag">closed</span>}
                  {model.moe ? <span className="tag">MoE</span> : null}
                  <div className="muted" style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}>
                    {[
                      model.paramsTotal && `params ${model.paramsTotal}`,
                      model.paramsActive && `active ${model.paramsActive}`,
                      model.contextWindow && `ctx ${model.contextWindow}`,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </div>
                  {model.capabilityDelta ? (
                    <div style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>
                      Δ {model.capabilityDelta}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
