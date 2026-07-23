import Link from "next/link";
import { PriorityBadge, SeverityBadge } from "@/components/Badges";
import { RoadmapBoard } from "@/components/RoadmapBoard";
import {
  getCompetitiveCoverage,
  getEvents,
  getGaps,
  getMeta,
  getPortfolioSummary,
  getRoadmapItems,
} from "@/lib/data";

export default function CommandCenterPage() {
  const meta = getMeta();
  const roadmap = getRoadmapItems();
  const portfolio = getPortfolioSummary();
  const gaps = getGaps().filter((gap) => gap.status !== "won" && gap.status !== "wontfix");
  const decisions = gaps.filter((gap) => gap.priority === "high").slice(0, 4);
  const events = getEvents(6);
  const coverageFocus = getCompetitiveCoverage()
    .filter((row) => row.companyId === "xai" || row.full + row.partial + row.missing >= 8)
    .sort((a, b) => Number(b.companyId === "xai") - Number(a.companyId === "xai"))
    .slice(0, 6);

  return (
    <>
      <header className="page-header command-header">
        <div>
          <div className="eyebrow">Director product portfolio</div>
          <h1>Grok suite command center</h1>
          <p className="subtitle">
            Proposed product strategy · Baseline <strong>{meta.baseline_date ?? "—"}</strong> ·
            Intelligence as of <strong>{meta.as_of ?? "—"}</strong>
          </p>
        </div>
        <div className="truth-label">
          <span className="truth-dot" /> Directional roadmap, not committed delivery
        </div>
      </header>

      <section className="card research-heat">
        <div className="eyebrow">July 2026 competitive heat</div>
        <p>
          Primary-source research is re-ranking the portfolio around Kimi K3, GPT-5.6 Sol,
          Claude Fable 5, GLM-5.2, and Inkling. Grok 4.5 remains competitive on key boards;
          the highest-leverage gaps are distribution, generation narrative, and coding-agent
          productization—not a blanket capability deficit.
        </p>
      </section>

      <section className="portfolio-strip" aria-label="Portfolio summary">
        <div><span>Suite pillars</span><strong>{portfolio.pillars}</strong></div>
        <div><span>Now</span><strong>{portfolio.now}</strong></div>
        <div><span>Next</span><strong>{portfolio.next}</strong></div>
        <div><span>Later</span><strong>{portfolio.later}</strong></div>
        <div className="portfolio-risk"><span>High gaps</span><strong>{portfolio.highGaps}</strong></div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <div className="eyebrow">Portfolio direction</div>
            <h2>Now / Next / Later suite roadmap</h2>
          </div>
          <Link href="/roadmap">Open roadmap workspace →</Link>
        </div>
        <RoadmapBoard items={roadmap} />
      </section>

      <div className="director-grid">
        <section className="card decision-panel">
          <div className="section-heading compact">
            <div><div className="eyebrow">Leadership queue</div><h2>Decisions and risks</h2></div>
            <Link href="/gaps">All gaps →</Link>
          </div>
          <div className="decision-list">
            {decisions.map((gap, index) => (
              <article className="decision-item" key={gap.id}>
                <span className="decision-number">0{index + 1}</span>
                <div>
                  <div className="gap-meta">
                    <PriorityBadge priority={gap.priority} />
                    <span className="tag">{gap.ownerTeam}</span>
                    <span className="muted">score {gap.priorityScore}</span>
                  </div>
                  <h3>{gap.title}</h3>
                  <p>{gap.recommendedAction}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="card coverage-panel">
          <div className="section-heading compact">
            <div><div className="eyebrow">Competitor analysis</div><h2>Feature coverage</h2></div>
            <Link href="/matrix">Matrix →</Link>
          </div>
          <p className="panel-note">Directional coverage of known matrix cells—not a model-quality ranking.</p>
          <div className="coverage-list">
            {coverageFocus.map((row) => (
              <div className={row.companyId === "xai" ? "coverage-row is-grok" : "coverage-row"} key={row.companyId}>
                <div className="coverage-label"><strong>{row.companyName}</strong><span>{row.knownCoveragePercent}%</span></div>
                <div className="coverage-track" aria-label={`${row.companyName} ${row.knownCoveragePercent}% weighted coverage`}>
                  <span style={{ width: `${row.knownCoveragePercent}%` }} />
                </div>
                <div className="coverage-counts">
                  <span>{row.full} full</span><span>{row.partial} partial</span><span>{row.missing} missing</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card signals-panel">
          <div className="section-heading compact">
            <div><div className="eyebrow">Market movement</div><h2>Critical signals</h2></div>
            <Link href="/timeline">Timeline →</Link>
          </div>
          <div className="signal-list">
            {events.map(({ event, companyName }) => (
              <article key={event.id}>
                <time>{event.occurredAt}</time>
                <div>
                  <SeverityBadge severity={event.severity} />
                  <h3>{event.title}</h3>
                  <p>{companyName ?? "Industry"} · {event.eventType.replaceAll("_", " ")}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
