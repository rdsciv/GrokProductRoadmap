"use client";

import { useEffect, useRef } from "react";

export type FilterOption = { label: string; value: string };

function applyFilters(scope: string, form: HTMLFormElement) {
  const values = Object.fromEntries(
    [...new FormData(form).entries()].map(([key, value]) => [key, String(value).toLowerCase()]),
  );
  const q = values.q ?? "";

  if (scope === "matrix") {
    const company = values.company ?? "";
    const region = values.region ?? "";
    document.querySelectorAll<HTMLElement>("[data-matrix-company]").forEach((cell) => {
      cell.hidden = Boolean(
        (company && cell.dataset.matrixCompany !== company) ||
          (region && cell.dataset.region !== region),
      );
    });
  }

  const rows = [...document.querySelectorAll<HTMLElement>(`[data-filter-scope="${scope}"]`)];
  let visible = 0;
  for (const row of rows) {
    let matches = !q || (row.dataset.search ?? "").includes(q);
    for (const [key, selected] of Object.entries(values)) {
      if (!selected || key === "q" || (scope === "matrix" && ["company", "region", "evidence"].includes(key))) continue;
      matches &&= (row.dataset[key] ?? "") === selected;
    }
    if (scope === "matrix" && matches && values.evidence) {
      const cells = [...row.querySelectorAll<HTMLElement>("[data-evidence]")].filter((cell) => !cell.hidden);
      matches = values.evidence === "sourced"
        ? cells.length > 0 && cells.every((cell) => cell.dataset.evidence === "yes")
        : cells.some((cell) => cell.dataset.evidence === "no");
    }
    row.hidden = !matches;
    if (matches) visible += 1;
  }

  if (scope === "roadmap") {
    document.querySelectorAll<HTMLElement>(".roadmap-row").forEach((row) => {
      row.hidden = ![...row.querySelectorAll<HTMLElement>('[data-filter-scope="roadmap"]')]
        .some((item) => !item.hidden);
    });
  }

  const count = document.querySelector<HTMLElement>(`[data-filter-count="${scope}"]`);
  if (count) count.textContent = `${visible} of ${rows.length}`;
  const empty = document.querySelector<HTMLElement>(`[data-filter-empty="${scope}"]`);
  if (empty) empty.hidden = visible !== 0;
}

export function FilterBar({
  search,
  selects,
  scope,
}: {
  search?: { placeholder: string };
  selects: Array<{
    name: string;
    label: string;
    options: FilterOption[];
  }>;
  scope: "roadmap" | "gaps" | "matrix" | "timeline" | "sources";
}) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const params = new URLSearchParams(window.location.search);
    for (const [name, selected] of params) {
      const field = form.elements.namedItem(name);
      if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement) field.value = selected;
    }
    applyFilters(scope, form);
  }, [scope]);

  return (
    <form
      className="filter-bar"
      ref={formRef}
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const params = new URLSearchParams();
        for (const [key, value] of new FormData(form)) {
          if (String(value)) params.set(key, String(value));
        }
        window.history.replaceState(null, "", `${window.location.pathname}${params.size ? `?${params}` : ""}`);
        applyFilters(scope, form);
      }}
      onReset={(event) => {
        const form = event.currentTarget;
        window.setTimeout(() => {
          window.history.replaceState(null, "", window.location.pathname);
          applyFilters(scope, form);
        });
      }}
    >
      {search ? (
        <label className="search-field">
          <span>Search</span>
          <input name="q" placeholder={search.placeholder} />
        </label>
      ) : null}
      {selects.map((select) => (
        <label key={select.name}>
          <span>{select.label}</span>
          <select name={select.name} defaultValue="">
            <option value="">All</option>
            {select.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ))}
      <button type="submit">Apply</button>
      <button className="clear-filters" type="reset">Clear</button>
    </form>
  );
}
