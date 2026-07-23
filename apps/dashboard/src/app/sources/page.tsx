import { getSources } from "@/lib/queries";
import { FilterBar } from "@/components/FilterBar";

export default function SourcesPage() {
  const sources = getSources();

  return (
    <>
      <h1>Sources & collector health</h1>
      <p className="subtitle">
        Monitored URLs for daily/weekly/quarterly scrapes. Run{" "}
        <code style={{ color: "var(--accent)" }}>npm run collect</code> to refresh hashes and alerts.
      </p>

      <FilterBar
        scope="sources"
        search={{ placeholder: "Search source names, types, and URLs" }}
        selects={[
          { name: "cadence", label: "Cadence", options: [...new Set(sources.map((source) => source.cadence))].sort().map((option) => ({ value: option, label: option })) },
          { name: "status", label: "Health", options: [{ value: "ok", label: "Healthy" }, { value: "error", label: "Error" }, { value: "never", label: "Never checked" }] },
        ]}
      />

      <div className="table-wrap">
        <table>
          <caption>Collector source configuration and latest health</caption>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Cadence</th>
              <th>Enabled</th>
              <th>Last check</th>
              <th>Status</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            <tr data-filter-empty="sources" hidden><td colSpan={7}>No sources match these filters.</td></tr>
            {sources.map((s) => (
              <tr
                key={s.id}
                data-filter-scope="sources"
                data-cadence={s.cadence}
                data-status={s.lastStatus ?? "never"}
                data-search={`${s.name} ${s.url} ${s.sourceType}`.toLowerCase()}
              >
                <td>
                  <strong>{s.name}</strong>
                </td>
                <td>
                  <span className="tag">{s.sourceType}</span>
                </td>
                <td>{s.cadence}</td>
                <td>{s.enabled ? "yes" : "no"}</td>
                <td className="timeline-date">{s.lastCheckedAt?.slice(0, 19) ?? "never"}</td>
                <td>{s.lastStatus ?? "—"}</td>
                <td>
                  <a href={s.url} target="_blank" rel="noreferrer">
                    open
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
