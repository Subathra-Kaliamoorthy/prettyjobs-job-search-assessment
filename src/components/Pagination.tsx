type Props = {
  page: number;
  totalPages: number;
  onPage: (page: number) => void;
};

/** Page numbers around the current page, with ellipsis gaps. */
function pageWindow(page: number, totalPages: number): (number | 'gap')[] {
  const pages = new Set<number>([1, totalPages]);
  for (let p = page - 1; p <= page + 1; p += 1) {
    if (p >= 1 && p <= totalPages) pages.add(p);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | 'gap')[] = [];
  let previous = 0;
  for (const current of sorted) {
    if (previous && current - previous > 1) result.push('gap');
    result.push(current);
    previous = current;
  }
  return result;
}

const base =
  'min-w-10 rounded-lg border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40';
const idle = `${base} border-slate-300 bg-white text-slate-700 hover:border-brand-400 hover:text-brand-700`;
const active = `${base} border-brand-600 bg-brand-600 text-white`;

export default function Pagination({ page, totalPages, onPage }: Props) {
  if (totalPages <= 1) return null;

  return (
    <nav className="flex flex-wrap items-center justify-center gap-1.5" aria-label="Pagination">
      <button type="button" className={idle} onClick={() => onPage(page - 1)} disabled={page <= 1}>
        Previous
      </button>

      {pageWindow(page, totalPages).map((entry, index) =>
        entry === 'gap' ? (
          <span key={`gap-${index}`} className="px-1 text-slate-400">
            …
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            onClick={() => onPage(entry)}
            aria-current={entry === page ? 'page' : undefined}
            className={entry === page ? active : idle}
          >
            {entry}
          </button>
        ),
      )}

      <button
        type="button"
        className={idle}
        onClick={() => onPage(page + 1)}
        disabled={page >= totalPages}
      >
        Next
      </button>
    </nav>
  );
}
