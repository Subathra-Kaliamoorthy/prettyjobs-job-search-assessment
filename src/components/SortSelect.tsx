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
    <label className="flex items-center gap-2 text-sm text-slate-500">
      Sort
      <select
        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        value={value || 'newest'}
        onChange={(event) => onChange(event.target.value)}
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
