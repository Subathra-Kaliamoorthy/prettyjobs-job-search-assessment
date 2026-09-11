import { useEffect, useRef, useState } from 'react';
import { LOCATIONS } from '../../db/data';

type Props = {
  initial: string;
  location: string;
  onSearch: (keyword: string) => void;
  onLocation: (location: string) => void;
  total: number;
};

export default function SearchBar({ initial, location, onSearch, onLocation, total }: Props) {
  const [value, setValue] = useState(initial);

  // `onSearch` is a fresh closure every render. Holding it in a ref lets the
  // debounce effect depend only on the value while still calling the latest
  // version — otherwise a pending timer fires against stale URL state.
  const onSearchRef = useRef(onSearch);
  onSearchRef.current = onSearch;

  // Tracks the value we last pushed to the URL, so an inbound `initial` that
  // merely echoes our own push does not clobber newer keystrokes.
  const lastPushed = useRef(initial);

  useEffect(() => {
    if (initial !== lastPushed.current) {
      lastPushed.current = initial;
      setValue(initial);
    }
  }, [initial]);

  useEffect(() => {
    if (value === initial) return;
    const timer = setTimeout(() => {
      lastPushed.current = value;
      onSearchRef.current(value);
    }, 300);
    return () => clearTimeout(timer);
  }, [value, initial]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-700 to-fuchsia-700">
      {/* soft light blooms, purely decorative */}
      <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-fuchsia-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-0 size-80 rounded-full bg-violet-400/20 blur-3xl" />

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

        <div className="mt-7 flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl shadow-brand-900/30 sm:flex-row sm:items-center">
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
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Job title, company or skill"
              aria-label="Search jobs"
              className="w-full bg-transparent py-3 text-base text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="hidden h-8 w-px bg-slate-200 sm:block" />

          <div className="flex items-center gap-2 px-3">
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
            <select
              value={location}
              onChange={(event) => onLocation(event.target.value)}
              aria-label="Filter by location"
              className="w-full min-w-36 bg-transparent py-3 text-base text-slate-900 outline-none sm:w-auto"
            >
              <option value="">Any location</option>
              {LOCATIONS.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
