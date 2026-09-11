import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchJobs } from '../api/jobs';
import type { JobsResponse } from '../api/jobs';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import SortSelect from '../components/SortSelect';
import JobCard from '../components/JobCard';
import Pagination from '../components/Pagination';

type Patch = Record<string, string | string[]>;

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<JobsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // The URL is the single source of truth for all search state.
  const queryString = searchParams.toString();

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchJobs(new URLSearchParams(queryString), controller.signal)
      .then(setData)
      .catch((err: Error) => {
        // A non-OK response can resolve before the abort lands, so checking
        // the signal matters as much as checking the error name.
        if (!controller.signal.aborted && err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [queryString]);

  /**
   * Merge a patch into the URL. Any filter change resets to page 1.
   * Uses the functional form so a debounced caller always writes against the
   * current params rather than the ones captured when it was created.
   */
  const update = (patch: Patch) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      for (const [key, value] of Object.entries(patch)) {
        next.delete(key);
        if (Array.isArray(value)) value.filter(Boolean).forEach((v) => next.append(key, v));
        else if (value) next.set(key, value);
      }
      if (!('page' in patch)) next.delete('page');
      return next;
    });
  };

  const jobTypes = searchParams.getAll('jobType');
  const experiences = searchParams.getAll('experience');

  const toggle = (key: 'jobType' | 'experience', value: string) => {
    const current = key === 'jobType' ? jobTypes : experiences;
    const nextValues = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    update({ [key]: nextValues });
  };

  const goToPage = (page: number) => {
    update({ page: String(page) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const minSalaryValue = Number(searchParams.get('minSalary')) || 0;
  const maxSalaryValue = Number(searchParams.get('maxSalary')) || 0;
  const invertedSalaryRange =
    minSalaryValue > 0 && maxSalaryValue > 0 && minSalaryValue > maxSalaryValue;

  const activeCount =
    jobTypes.length +
    experiences.length +
    (searchParams.get('minSalary') ? 1 : 0) +
    (searchParams.get('maxSalary') ? 1 : 0);

  const hasAnything =
    activeCount > 0 || !!searchParams.get('q') || !!searchParams.get('location');

  return (
    <>
      <SearchBar
        initial={searchParams.get('q') ?? ''}
        location={searchParams.get('location') ?? ''}
        onSearch={(keyword) => update({ q: keyword })}
        onLocation={(location) => update({ location })}
        total={data?.total ?? 0}
      />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <Filters
            jobTypes={jobTypes}
            experiences={experiences}
            minSalary={searchParams.get('minSalary') ?? ''}
            maxSalary={searchParams.get('maxSalary') ?? ''}
            onToggle={toggle}
            onChange={update}
            onReset={() => setSearchParams(new URLSearchParams())}
            activeCount={activeCount}
          />

          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-600">
                {loading && !data ? (
                  'Searching…'
                ) : (
                  <>
                    <span className="font-semibold text-slate-900">
                      {data?.total.toLocaleString('en-IN') ?? 0}
                    </span>{' '}
                    {data?.total === 1 ? 'job' : 'jobs'} found
                    {data && data.totalPages > 1 && (
                      <span className="text-slate-400">
                        {' '}
                        · page {page} of {data.totalPages}
                      </span>
                    )}
                  </>
                )}
              </p>
              <SortSelect
                value={searchParams.get('sort') ?? 'newest'}
                onChange={(sort) => update({ sort })}
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {!error && data && data.jobs.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <div className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-slate-100 text-2xl">
                  🔍
                </div>
                <p className="font-semibold text-slate-900">No jobs match your search</p>
                <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                  {invertedSalaryRange
                    ? 'Your minimum salary is higher than your maximum — widen the salary range.'
                    : 'Try removing a filter or searching for a different keyword.'}
                </p>
                {hasAnything && (
                  <button
                    type="button"
                    onClick={() => setSearchParams(new URLSearchParams())}
                    className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}

            {!error && data && data.jobs.length > 0 && (
              <div className={`space-y-3 transition ${loading ? 'opacity-50' : ''}`}>
                {data.jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}

            {!error && data && data.jobs.length > 0 && (
              <div className="mt-8">
                <Pagination page={page} totalPages={data.totalPages} onPage={goToPage} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
