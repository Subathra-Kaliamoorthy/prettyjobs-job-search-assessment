/**
 * Domain vocabulary shared by the seed script, the API and the frontend.
 *
 * This lives outside `db/` deliberately. The filter dropdowns must offer exactly
 * the values present in the database, so both sides derive from one file — but
 * importing `db/data.ts` from the browser would put 42 KB of seed vocabulary one
 * careless value-import away from the client bundle. Nothing here imports
 * Drizzle or the seed data, so it is safe for all three runtimes.
 */

export const JOB_TYPES = ['full-time', 'part-time', 'contract', 'remote'] as const;
export const EXPERIENCE_LEVELS = ['entry', 'mid', 'senior', 'lead'] as const;

export type JobType = (typeof JOB_TYPES)[number];
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export const LOCATIONS = [
  'Bangalore', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Chennai',
  'Pune', 'Kolkata', 'Ahmedabad', 'Gurugram', 'Noida',
  'Kochi', 'Coimbatore', 'Jaipur', 'Chandigarh', 'Indore',
];
