import { Hono } from 'hono';
import { and, or, eq, ilike, gte, lte, asc, desc, sql, count, inArray } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { makeDb } from '../db/client';
import { jobs } from '../db/schema';

type Bindings = { DATABASE_URL: string };

const app = new Hono<{ Bindings: Bindings }>();

/**
 * Sort is resolved through this whitelist so a user-supplied string can never
 * reach the query builder as a column name.
 */
const SORTS = {
  newest: desc(jobs.postedAt),
  oldest: asc(jobs.postedAt),
  salary_desc: desc(jobs.salaryMax),
  salary_asc: asc(jobs.salaryMin),
};

/** Columns returned by the list endpoint. `description` is omitted — the list
 *  view never renders it, and 20 descriptions per page is dead weight. */
const LIST_COLUMNS = {
  id: jobs.id,
  title: jobs.title,
  company: jobs.company,
  location: jobs.location,
  jobType: jobs.jobType,
  salaryMin: jobs.salaryMin,
  salaryMax: jobs.salaryMax,
  experienceLevel: jobs.experienceLevel,
  skills: jobs.skills,
  postedAt: jobs.postedAt,
  // Card preview only — truncated in SQL so the payload stays small.
  excerpt: sql<string>`left(${jobs.description}, 180)`,
};

/** Postgres int4 ceiling. Values beyond it are clamped rather than passed
 *  through, which would make the driver raise 22003 and turn an out-of-range
 *  filter into a 500 instead of an empty result set. */
const INT32_MAX = 2147483647;

const toInt = (value: string | undefined): number | undefined => {
  if (!value) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return undefined;
  return Math.min(INT32_MAX, Math.max(-INT32_MAX, Math.trunc(parsed)));
};

/** Escape LIKE metacharacters so `_` and `%` are searched literally.
 *  Without this, `?q=_` matches every row. */
const escapeLike = (value: string) => value.replace(/[\\%_]/g, (char) => `\\${char}`);

app.get('/api/jobs', async (c) => {
  const db = makeDb(c.env.DATABASE_URL);
  const query = c.req.query();

  const page = Math.max(1, toInt(query.page) ?? 1);
  const limit = Math.min(100, Math.max(1, toInt(query.limit) ?? 20));

  // Every filter is applied in SQL. Nothing is filtered client-side.
  const conditions: SQL[] = [];

  const keyword = query.q?.trim();
  if (keyword) {
    const pattern = `%${escapeLike(keyword)}%`;
    // The brief scopes keyword search to title, company and skills.
    conditions.push(
      or(
        ilike(jobs.title, pattern),
        ilike(jobs.company, pattern),
        sql`array_to_string(${jobs.skills}, ' ') ILIKE ${pattern}`,
      )!,
    );
  }

  if (query.location) conditions.push(eq(jobs.location, query.location));

  // jobType and experience are repeatable (?jobType=remote&jobType=contract)
  // so the sidebar checkboxes can select several at once.
  const jobTypes = c.req.queries('jobType')?.filter(Boolean) ?? [];
  if (jobTypes.length) conditions.push(inArray(jobs.jobType, jobTypes));

  const experiences = c.req.queries('experience')?.filter(Boolean) ?? [];
  if (experiences.length) conditions.push(inArray(jobs.experienceLevel, experiences));

  // A job matches a salary window if its band overlaps the requested band.
  // Non-positive bounds are treated as unset: "max salary ₹0" excludes every
  // job in the database, and is trivially produced by the number input's
  // spinner, so it is never what the user meant.
  const minSalary = toInt(query.minSalary);
  if (minSalary !== undefined && minSalary > 0) conditions.push(gte(jobs.salaryMax, minSalary));
  const maxSalary = toInt(query.maxSalary);
  if (maxSalary !== undefined && maxSalary > 0) conditions.push(lte(jobs.salaryMin, maxSalary));

  const where = conditions.length ? and(...conditions) : undefined;

  // Object.hasOwn, not a bare lookup: a plain object literal resolves
  // inherited keys, so `?sort=constructor` would otherwise pass a function
  // into orderBy and blow up the request.
  const sortKey =
    query.sort && Object.hasOwn(SORTS, query.sort)
      ? (query.sort as keyof typeof SORTS)
      : 'newest';
  const orderBy = SORTS[sortKey];

  // count(*) over() returns the total alongside the page in ONE round trip.
  // The Neon HTTP driver sends one request per statement, so a separate
  // count query would double the latency of every search.
  const rows = await db
    .select({ ...LIST_COLUMNS, total: sql<number>`count(*) over()`.mapWith(Number) })
    .from(jobs)
    .where(where)
    .orderBy(orderBy, asc(jobs.id))
    .limit(limit)
    .offset((page - 1) * limit);

  // count(*) over() is computed per returned row, so an offset past the last
  // row yields no rows and no total. Fall back to a real count so a stale
  // bookmarked ?page=N still reports the true size and the client can page back.
  let total = rows[0]?.total ?? 0;
  if (rows.length === 0 && page > 1) {
    const [countRow] = await db.select({ value: count() }).from(jobs).where(where);
    total = countRow?.value ?? 0;
  }

  return c.json({
    jobs: rows.map(({ total: _total, ...job }) => job),
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
});

app.get('/api/jobs/:id', async (c) => {
  const id = toInt(c.req.param('id'));
  if (id === undefined || id < 1) return c.json({ error: 'Invalid job id' }, 400);

  const db = makeDb(c.env.DATABASE_URL);
  const [job] = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);

  if (!job) return c.json({ error: 'Job not found' }, 404);
  return c.json(job);
});

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app;
