import { getSources } from "@/lib/queries";
import { FilterBar } from "@/components/FilterBar";

export const dynamic = "force-dynamic";

type Params = Record<string, string | string[] | undefined>;
const value = (input: string | string[] | undefined) => typeof input === "string" ? input : "";

export default async function SourcesPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const q = value(params.q).toLowerCase();
  const cadence = value(params.cadence);
  const status = value(params.status);
  const allSources = getSources();
  const sources = allSources.filter((source) =>
    (!q || `${source.name} ${source.url} ${source.sourceType}`.toLowerCase().includes(q)) &&
    (!cadence || source.cadence === cadence) &&
    (!status || (status === "never" ? !source.lastStatus : source.lastStatus === status)));

  return (
    <>
      <h1>Sources & collector health</h1>
      <p className="subtitle">
        Monitored URLs for daily/weekly/quarterly scrapes. Run{" "}
        <code style={{ color: "var(--accent)" }}>npm run collect</code> to refresh hashes and alerts.
      </p>

      <FilterBar
        search={{ value: value(params.q), placeholder: "Search source names, types, and URLs" }}
        selects={[
          { name: "cadence", label: "Cadence", value: cadence, options: [...new Set(allSources.map((source) => source.cadence))].sort().map((option) => ({ value: option, label: option })) },
          { name: "status", label: "Health", value: status, options: [{ value: "ok", label: "Healthy" }, { value: "error", label: "Error" }, { value: "never", label: "Never checked" }] },
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
            {sources.length === 0 ? <tr><td colSpan={7}>No sources match these filters.</td></tr> : null}
            {sources.map((s) => (
              <tr key={s.id}>
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
