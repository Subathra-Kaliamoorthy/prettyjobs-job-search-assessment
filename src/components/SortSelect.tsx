import Select from './Select';

type Props = {
  value: string;
  onChange: (sort: string) => void;
};

const OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'salary_desc', label: 'Salary: high to low' },
  { value: 'salary_asc', label: 'Salary: low to high' },
];

export default function SortSelect({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-500">
      <span className="shrink-0">Sort</span>
      <Select
        value={value || 'newest'}
        options={OPTIONS}
        onChange={onChange}
        ariaLabel="Sort jobs"
        align="right"
        triggerClass="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 outline-none transition hover:border-brand-400 focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-100"
      />
    </div>
  );
}
