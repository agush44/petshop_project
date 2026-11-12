import { Search } from "lucide-react";

export default function AdminTableToolbar({ search, onSearchChange, sort, onSortChange, sortOptions, count, noun }) {
  return (
    <div className="mb-4 flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-sm sm:flex-row sm:items-center">
      <label className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={`Buscar ${noun}...`}
          aria-label={`Buscar ${noun}`}
          className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
        />
      </label>
      <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <span>Ordenar</span>
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          aria-label={`Ordenar ${noun}`}
          className="h-10 rounded-md border border-input bg-background px-3 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>
      <span className="text-xs text-muted-foreground sm:ml-2">{count} {noun}</span>
    </div>
  );
}
