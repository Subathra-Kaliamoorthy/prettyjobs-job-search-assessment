import { JOB_TYPES, EXPERIENCE_LEVELS } from '../../shared/constants';
import { titleCase } from '../format';

type Props = {
  jobTypes: string[];
  experiences: string[];
  minSalary: string;
  maxSalary: string;
  onToggle: (key: 'jobType' | 'experience', value: string) => void;
  onChange: (patch: Record<string, string>) => void;
  onReset: () => void;
  activeCount: number;
};

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-2.5 py-1.5 text-sm text-slate-700 select-none">
      <span
        className={`grid size-[18px] shrink-0 place-items-center rounded-[5px] border transition ${
          checked
            ? 'border-brand-600 bg-brand-600'
            : 'border-slate-300 bg-white group-hover:border-brand-400'
        }`}
      >
        {checked && (
          <svg className="size-3 text-white" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="m2.5 6.2 2.2 2.2L9.5 3.6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span className={checked ? 'font-medium text-slate-900' : ''}>{label}</span>
    </label>
  );
}

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100';

export default function Filters({
  jobTypes,
  experiences,
  minSalary,
  maxSalary,
  onToggle,
  onChange,
  onReset,
  activeCount,
}: Props) {
  return (
    <aside className="lg:sticky lg:top-20">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
            Filters
            {activeCount > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
                {activeCount}
              </span>
            )}
          </h2>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="text-sm font-medium text-fuchsia-600 transition hover:text-fuchsia-800"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="mt-5 border-t border-slate-100 pt-4">
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Job type
          </h3>
          {JOB_TYPES.map((type) => (
            <CheckRow
              key={type}
              label={titleCase(type)}
              checked={jobTypes.includes(type)}
              onChange={() => onToggle('jobType', type)}
            />
          ))}
        </div>

        <div className="mt-4 border-t border-slate-100 pt-4">
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Experience level
          </h3>
          {EXPERIENCE_LEVELS.map((level) => (
            <CheckRow
              key={level}
              label={titleCase(level)}
              checked={experiences.includes(level)}
              onChange={() => onToggle('experience', level)}
            />
          ))}
        </div>

        <div className="mt-4 border-t border-slate-100 pt-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Salary range (₹ per year)
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              step={100000}
              placeholder="Min"
              aria-label="Minimum salary"
              className={inputClass}
              value={minSalary}
              onChange={(e) => onChange({ minSalary: e.target.value })}
            />
            <span className="text-slate-400">–</span>
            <input
              type="number"
              min={0}
              step={100000}
              placeholder="Max"
              aria-label="Maximum salary"
              className={inputClass}
              value={maxSalary}
              onChange={(e) => onChange({ maxSalary: e.target.value })}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
