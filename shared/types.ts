import type { JobType, ExperienceLevel } from './constants';

/**
 * The API wire contract, shared by the Worker and the browser.
 *
 * Deliberately declared here rather than derived from the Drizzle row type:
 * the wire format is not the database row. `postedAt` serialises to an ISO
 * string, list responses omit `description` and carry a truncated `excerpt`
 * instead. Declaring it once keeps the browser from importing the ORM schema.
 */

export type JobListItem = {
  id: number;
  title: string;
  company: string;
  location: string;
  jobType: JobType;
  salaryMin: number;
  salaryMax: number;
  experienceLevel: ExperienceLevel;
  skills: string[];
  postedAt: string;
  /** First 180 characters of the description, truncated server-side. */
  excerpt: string;
};

export type JobDetail = Omit<JobListItem, 'excerpt'> & { description: string };

export type JobsResponse = {
  jobs: JobListItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
