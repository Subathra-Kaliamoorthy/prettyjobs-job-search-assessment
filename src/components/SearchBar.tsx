import { useEffect, useState } from 'react';
import { LOCATIONS } from '../../shared/constants';
import Select from './Select';

const LOCATION_OPTIONS = [
  { value: '', label: 'Any location' },
  ...LOCATIONS.map((city) => ({ value: city, label: city })),
];

type Props = {
  initialKeyword: string;
  initialLocation: string;
  onSearch: (keyword: string, location: string) => void;
  total: number;
};

export default function SearchBar({ initialKeyword, initialLocation, onSearch, total }: Props) {
  // Keyword and location are held locally and applied only on submit, so the
  // query bar behaves like a form. The sidebar filters stay instant.
  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(initialLocation);

  // Resync when the URL changes from elsewhere: back button, "Clear all".
  useEffect(() => setKeyword(initialKeyword), [initialKeyword]);
  useEffect(() => setLocation(initialLocation), [initialLocation]);

  // Typing without submitting would otherwise look like a broken search, so
  // the UI advertises that there is something waiting to be applied.
  const dirty = keyword !== initialKeyword || location !== initialLocation;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(keyword, location);
  };

  return (
    // z-20 keeps an open dropdown above the results below. The section itself
    // must NOT clip, or the dropdown panel is cut off at the hero's edge.
    <section className="relative z-20 bg-gradient-to-br from-brand-900 via-brand-700 to-fuchsia-700">
      {/* Decorative blooms get their own clipping layer so they stay inside the
          hero without the section needing overflow-hidden. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 size-72 rounded-full bg-fuchsia-500/30 blur-3xl" />
        <div className="absolute -bottom-32 right-0 size-80 rounded-full bg-violet-400/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/20">
          <span className="size-1.5 rounded-full bg-emerald-300" />
          {total.toLocaleString('en-IN')} open roles across 20 industries
        </p>

        <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Find the job that fits your life.
        </h1>
        <p className="mt-2 max-w-xl text-sm text-violet-100 sm:text-base">
          Search engineering, healthcare, finance, trades and more — filtered the way you
          actually think about work.
        </p>

        <form
          onSubmit={submit}
          className="mt-7 flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl shadow-brand-900/30 sm:flex-row sm:items-center"
        >
          <div className="flex flex-1 items-center gap-2 px-3">
            <svg
              className="size-5 shrink-0 text-slate-400"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="9" cy="9" r="6" />
              <path d="m14 14 4 4" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Job title, company or skill"
              aria-label="Search by job title, company or skill"
              className="w-full bg-transparent py-3 text-base text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="hidden h-8 w-px bg-slate-200 sm:block" />

          <div className="px-3 sm:min-w-48">
            <Select
              value={location}
              onChange={setLocation}
              ariaLabel="Filter by location"
              placeholder="Any location"
              options={LOCATION_OPTIONS}
              triggerClass="py-3 text-base text-slate-900 outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-brand-200"
              icon={
                <svg
                  className="size-5 shrink-0 text-slate-400"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M10 18s6-5.2 6-9a6 6 0 1 0-12 0c0 3.8 6 9 6 9Z" />
                  <circle cx="10" cy="9" r="2" />
                </svg>
              }
            />
          </div>

          <button
            type="submit"
            className={`shrink-0 rounded-xl bg-brand-600 px-7 py-3 text-base font-semibold text-white transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 ${
              dirty ? 'ring-2 ring-brand-300 ring-offset-2' : ''
            }`}
          >
            Search
          </button>
        </form>

        {/* Fixed height so applying a search does not shift the layout. */}
        <p className="mt-2 h-4 text-xs text-violet-200">
          {dirty ? 'Press Enter or click Search to apply' : ''}
        </p>
      </div>
    </section>
  );
}
