import { SupportCell } from "@/components/Badges";
import { FilterBar } from "@/components/FilterBar";
import { getCompanies, getFeatures, getMatrix, getMeta } from "@/lib/queries";

export const dynamic = "force-dynamic";

const MATRIX_COMPANIES = [
  "xai",
  "openai",
  "anthropic",
  "google",
  "microsoft",
  "deepseek",
  "moonshot",
  "meta",
];

type Params = Record<string, string | string[] | undefined>;
const value = (input: string | string[] | undefined) => typeof input === "string" ? input : "";

export default async function MatrixPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const category = value(params.category);
  const region = value(params.region);
  const company = value(params.company);
  const evidence = value(params.evidence);
  const meta = getMeta();
  const allFeatures = getFeatures();
  const allCompanies = getCompanies().filter((c) => MATRIX_COMPANIES.includes(c.id));
  const companies = allCompanies.filter((item) =>
    (!region || item.region === region) && (!company || item.id === company));
  // preserve MATRIX_COMPANIES order
  const ordered = MATRIX_COMPANIES.map((id) => companies.find((c) => c.id === id)).filter(
    Boolean,
  ) as typeof companies;
  const cells = getMatrix();

  const cellMap = new Map<string, (typeof cells)[0]>();
  for (const c of cells) {
    cellMap.set(`${c.companyId}::${c.featureId}`, c);
  }
  const features = allFeatures.filter((feature) => {
    if (category && feature.category !== category) return false;
    const displayedCells = ordered
      .map((item) => cellMap.get(`${item.id}::${feature.id}`))
      .filter(Boolean);
    if (evidence === "missing") return displayedCells.some((cell) => !cell?.evidenceUrl);
    if (evidence === "sourced") return displayedCells.length > 0 && displayedCells.every((cell) => cell?.evidenceUrl);
    return true;
  });

  return (
    <>
      <h1>Feature comparison matrix</h1>
      <p className="subtitle">
        Primary Grok-gap view · support levels as of {meta.as_of ?? "—"}. Hover cells for notes.
      </p>

      <FilterBar selects={[
        { name: "category", label: "Category", value: category, options: [...new Set(allFeatures.map((item) => item.category))].sort().map((option) => ({ value: option, label: option })) },
        { name: "region", label: "Region", value: region, options: [{ value: "western", label: "Western" }, { value: "chinese", label: "Chinese" }] },
        { name: "company", label: "Company", value: company, options: allCompanies.map((item) => ({ value: item.id, label: item.name })) },
        { name: "evidence", label: "Evidence", value: evidence, options: [{ value: "sourced", label: "Fully sourced row" }, { value: "missing", label: "Has evidence debt" }] },
      ]} />

      <div className="legend">
        <span>
          <span className="cell cell-none">none</span> missing
        </span>
        <span>
          <span className="cell cell-partial">partial</span> incomplete
        </span>
        <span>
          <span className="cell cell-full">full</span> competitive
        </span>
        <span>
          <span className="cell cell-superior">superior</span> leader
        </span>
        <span>
          <span className="cell cell-unknown">unknown</span> unverified
        </span>
      </div>

      <div className="table-wrap">
        <table className="matrix-table">
          <caption>Feature support by company</caption>
          <thead>
            <tr>
              <th>Feature</th>
              {ordered.map((c) => (
                <th key={c.id}>{c.name.split(" ")[0]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.length === 0 ? <tr><td colSpan={ordered.length + 1}>No matrix rows match these filters.</td></tr> : null}
            {features.map((f) => (
              <tr key={f.id}>
                <td>
                  <div>{f.name}</div>
                  <div className="muted" style={{ fontSize: "0.7rem" }}>
                    {f.category}
                  </div>
                </td>
                {ordered.map((c) => {
                  const cell = cellMap.get(`${c.id}::${f.id}`);
                  return (
                    <td key={c.id}>
                      {cell ? (
                        <SupportCell level={cell.supportLevel} notes={cell.notes} />
                      ) : (
                        <SupportCell level="unknown" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="card" style={{ marginTop: "1.25rem" }}>
        <h2>How to read Grok column</h2>
        <p className="muted" style={{ margin: 0 }}>
          <strong>none/partial</strong> cells vs OpenAI/Anthropic full/superior are the product and
          GTM attack surface. Enterprise SSO is full for Grok — the gap is packaging and public GTM,
          not raw identity features. Chinese open-weight and cost rows flag margin and velocity risk.
        </p>
      </section>
    </>
  );
}
