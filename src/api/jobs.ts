import type { Job } from '../../db/schema';

// The DB row is the source of truth for field names, but JSON serialises
// `postedAt` as an ISO string rather than a Date.
export type JobListItem = Omit<Job, 'description' | 'postedAt'> & {
  postedAt: string;
  /** First 180 chars of the description, truncated server-side for the card. */
  excerpt: string;
};
export type JobDetail = Omit<Job, 'postedAt'> & { postedAt: string };

export type JobsResponse = {
  jobs: JobListItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export async function fetchJobs(params: URLSearchParams, signal?: AbortSignal): Promise<JobsResponse> {
  const response = await fetch(`/api/jobs?${params.toString()}`, { signal });
  if (!response.ok) throw new Error('Could not load jobs.');
  return response.json();
}

export async function fetchJob(id: string, signal?: AbortSignal): Promise<JobDetail> {
  const response = await fetch(`/api/jobs/${id}`, { signal });
  if (response.status === 404) throw new Error('That job could not be found.');
  if (!response.ok) throw new Error('Could not load this job.');
  return response.json();
}
