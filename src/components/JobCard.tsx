import { Link } from 'react-router-dom';
import type { JobListItem } from '../api/jobs';
import { formatSalary, formatPostedDate, titleCase } from '../format';

const BuildingIcon = () => (
  <svg className="size-4 shrink-0 text-slate-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <rect x="2.5" y="2" width="11" height="12" rx="1.5" />
    <path d="M6 5.5h1M9 5.5h1M6 8h1M9 8h1M6.5 14v-2.5h3V14" strokeLinecap="round" />
  </svg>
);

const PinIcon = () => (
  <svg className="size-4 shrink-0 text-slate-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M8 14.5s4.5-4.2 4.5-7.3a4.5 4.5 0 1 0-9 0C3.5 10.3 8 14.5 8 14.5Z" />
    <circle cx="8" cy="7" r="1.6" />
  </svg>
);

export default function JobCard({ job }: { job: JobListItem }) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-slate-900 transition group-hover:text-brand-700 sm:text-lg">
            <Link to={`/job/${job.id}`} className="outline-none hover:underline focus-visible:underline">
              {job.title}
            </Link>
          </h2>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <BuildingIcon />
              {job.company}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <PinIcon />
              {job.location}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-sm font-semibold text-emerald-700">
            {formatSalary(job.salaryMin, job.salaryMax)}
          </span>
          <Link
            to={`/job/${job.id}`}
            className="rounded-lg border border-brand-600 px-4 py-1.5 text-sm font-medium text-brand-700 transition hover:bg-brand-600 hover:text-white"
          >
            View
          </Link>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">{job.excerpt}…</p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-md bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700">
            {titleCase(job.jobType)}
          </span>
          <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
            {titleCase(job.experienceLevel)}
          </span>
          {job.skills.slice(0, 4).map((skill) => (
            <span key={skill} className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="text-xs text-slate-400">+{job.skills.length - 4}</span>
          )}
        </div>
        <span className="text-xs text-slate-400">{formatPostedDate(job.postedAt)}</span>
      </div>
    </article>
  );
}
