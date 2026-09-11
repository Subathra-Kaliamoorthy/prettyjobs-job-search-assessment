import 'dotenv/config';
import { makeDb } from './client';
import { sql } from 'drizzle-orm';
import { jobs } from './schema';
import type { NewJob } from './schema';
import { INDUSTRIES } from './data';
import { LOCATIONS } from '../shared/constants';
import type { Industry, Role } from './data';
import type { ExperienceLevel } from '../shared/constants';

/**
 * Weighted rotation: an industry with weight N occupies N slots, so it takes
 * a proportionally larger share of the fixed TOTAL without increasing it.
 */
const ROTATION: Industry[] = INDUSTRIES.flatMap((industry) =>
  Array.from({ length: industry.weight ?? 1 }, () => industry),
);

const TOTAL = 1200;
const RANDOM_SEED = 20260911;
const CHUNK_SIZE = 400;

/**
 * mulberry32 — small seeded PRNG. Every generated field is reproducible across
 * runs; `postedAt` is the one exception, since it is anchored to the time the
 * seed runs so listings always look recent.
 */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(RANDOM_SEED);
const randInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
const pick = <T,>(items: readonly T[]): T => items[Math.floor(rand() * items.length)];

const pickMany = <T,>(items: readonly T[], count: number): T[] => {
  const pool = [...items];
  const chosen: T[] = [];
  while (chosen.length < count && pool.length > 0) {
    chosen.push(pool.splice(Math.floor(rand() * pool.length), 1)[0]);
  }
  return chosen;
};

const LEVEL_MULTIPLIER: Record<ExperienceLevel, number> = {
  entry: 0.55,
  mid: 1,
  senior: 1.6,
  lead: 2.3,
};

const LEVEL_PHRASE: Record<ExperienceLevel, string> = {
  entry: 'someone early in their career who learns quickly',
  mid: 'a professional with 3-5 years of relevant experience',
  senior: 'an experienced professional with 6-10 years behind them',
  lead: 'a seasoned leader with 10+ years and a track record of building teams',
};

const roundTo50k = (value: number) => Math.round(value / 50000) * 50000;

function buildTitle(role: Role, level: ExperienceLevel): string {
  switch (level) {
    case 'entry':
      return rand() < 0.5 ? `Junior ${role.title}` : `Trainee ${role.title}`;
    case 'senior':
      return `Senior ${role.title}`;
    case 'lead':
      return role.leadTitle ?? `Lead ${role.title}`;
    default:
      return role.title;
  }
}

function buildSalary(role: Role, level: ExperienceLevel): [number, number] {
  const multiplier = LEVEL_MULTIPLIER[level];
  const jitter = 0.92 + rand() * 0.16; // +/- 8%, so bands are not all identical
  let min = Math.max(100000, roundTo50k(role.salary[0] * multiplier * jitter));
  let max = roundTo50k(role.salary[1] * multiplier * jitter);
  if (max <= min) max = min + 100000;
  return [min, max];
}

function buildDescription(
  company: string,
  title: string,
  location: string,
  jobType: string,
  level: ExperienceLevel,
  role: Role,
  skills: string[],
): string {
  const focus = skills.slice(0, 3).join(', ');
  return [
    `${company} is hiring a ${title} to join our team in ${location}.`,
    `In this role you will ${role.summary}, working closely with colleagues across the business.`,
    `We are looking for ${LEVEL_PHRASE[level]}, with hands-on exposure to ${focus}.`,
    `This is a ${jobType} position. We offer a collaborative environment, structured growth and the space to do your best work.`,
  ].join(' ');
}

function generateJobs(): NewJob[] {
  const generated: NewJob[] = [];
  const seen = new Set<string>();
  const now = Date.now();

  let index = 0;
  // Guard against an unsatisfiable dedupe loop on small vocabularies.
  let attempts = 0;
  const maxAttempts = TOTAL * 20;

  while (generated.length < TOTAL && attempts < maxAttempts) {
    attempts += 1;

    // Round-robin across the weighted rotation so every sector stays
    // represented and no filter combination lands on an empty result set.
    const industry = ROTATION[index % ROTATION.length];
    index += 1;

    const role = pick(industry.roles);
    const company = pick(industry.companies);
    const level = pick(role.levels);
    const jobType = pick(role.jobTypes);
    const location = pick(LOCATIONS);
    const title = buildTitle(role, level);

    const key = `${title}|${company}|${location}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const skills = pickMany(role.skills, randInt(3, Math.min(6, role.skills.length)));
    const [salaryMin, salaryMax] = buildSalary(role, level);

    // Squaring the random value skews postings toward recent dates, so
    // "newest first" surfaces a genuinely fresh page.
    const daysAgo = Math.floor(90 * rand() * rand());
    const postedAt = new Date(now - daysAgo * 86400000);

    generated.push({
      title,
      company,
      location,
      jobType,
      salaryMin,
      salaryMax,
      experienceLevel: level,
      skills,
      description: buildDescription(company, title, location, jobType, level, role, skills),
      postedAt,
    });
  }

  return generated;
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL is not set. Add it to .env before seeding.');
    process.exit(1);
  }

  const db = makeDb(url);
  const rows = generateJobs();

  // Fail loudly rather than silently seeding fewer than required, which would
  // quietly break the "at least 1,000 listings" requirement.
  if (rows.length < TOTAL) {
    throw new Error(
      `Only generated ${rows.length} of ${TOTAL} jobs — the role/company vocabulary is too small to stay unique.`,
    );
  }

  console.log(`Generated ${rows.length} jobs across ${INDUSTRIES.length} industries.`);

  // TRUNCATE ... RESTART IDENTITY rather than DELETE: a plain delete leaves the
  // serial sequence where it was, so every re-seed pushes ids further from 1.
  console.log('Clearing existing jobs...');
  await db.execute(sql`TRUNCATE TABLE jobs RESTART IDENTITY`);

  // Chunked multi-row inserts: one statement per chunk, not one per row.
  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    const chunk = rows.slice(i, i + CHUNK_SIZE);
    await db.insert(jobs).values(chunk);
    console.log(`  inserted ${Math.min(i + CHUNK_SIZE, rows.length)} / ${rows.length}`);
  }

  console.log('Seed complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
