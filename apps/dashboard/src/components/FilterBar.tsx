export type FilterOption = { label: string; value: string };

export function FilterBar({
  search,
  selects,
}: {
  search?: { value?: string; placeholder: string };
  selects: Array<{
    name: string;
    label: string;
    value?: string;
    options: FilterOption[];
  }>;
}) {
  return (
    <form className="filter-bar" method="get" role="search">
      {search ? (
        <label className="search-field">
          <span>Search</span>
          <input name="q" defaultValue={search.value} placeholder={search.placeholder} />
        </label>
      ) : null}
      {selects.map((select) => (
        <label key={select.name}>
          <span>{select.label}</span>
          <select name={select.name} defaultValue={select.value ?? ""}>
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
      <a className="clear-filters" href="?">
        Clear
      </a>
    </form>
  );
}
