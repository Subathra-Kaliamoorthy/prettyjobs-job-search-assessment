import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { fetchJob } from '../api/jobs';
import type { JobDetail } from '../api/jobs';
import { formatSalary, formatPostedDate, titleCase } from '../format';

export default function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    // Drop the previous job, otherwise navigating to a missing id renders the
    // "not found" box with the old job still displayed beneath it.
    setJob(null);

    fetchJob(id, controller.signal)
      .then(setJob)
      .catch((err: Error) => {
        if (!controller.signal.aborted && err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <button
        type="button"
        // A shared /job/123 link opened in a fresh tab has no history to go
        // back to, which would navigate the user off the site.
        onClick={() => (location.key === 'default' ? navigate('/') : navigate(-1))}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 transition hover:text-brand-900"
      >
        <span aria-hidden="true">←</span> Back to jobs
      </button>

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <div className="h-7 w-2/3 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-slate-100" />
          <div className="mt-6 h-24 animate-pulse rounded bg-slate-100" />
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="font-medium text-red-800">{error}</p>
          <Link
            to="/"
            className="mt-3 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            Browse all jobs
          </Link>
        </div>
      )}

      {job && (
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-brand-900 via-brand-700 to-fuchsia-700 px-6 py-7 sm:px-8">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {job.title}
            </h1>
            <p className="mt-2 text-violet-100">
              {job.company} · {job.location}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-emerald-700">
                {formatSalary(job.salaryMin, job.salaryMax)}
              </span>
              <span className="rounded-lg bg-white/15 px-3 py-1.5 text-sm font-medium text-white ring-1 ring-white/25">
                {titleCase(job.jobType)}
              </span>
              <span className="rounded-lg bg-white/15 px-3 py-1.5 text-sm font-medium text-white ring-1 ring-white/25">
                {titleCase(job.experienceLevel)} level
              </span>
            </div>
          </div>

          <div className="px-6 py-6 sm:px-8">
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Skills
              </h2>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-brand-50 px-2.5 py-1 text-sm font-medium text-brand-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section className="mt-6 border-t border-slate-100 pt-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                About this role
              </h2>
              <p className="mt-2.5 leading-relaxed text-slate-700">{job.description}</p>
            </section>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
              <span className="text-xs text-slate-400">{formatPostedDate(job.postedAt)}</span>
              <button
                type="button"
                className="rounded-lg bg-gradient-to-r from-brand-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              >
                Apply now
              </button>
            </div>
          </div>
        </article>
      )}
    </div>
  );
}
