import type { JobListItem, JobDetail, JobsResponse } from '../../shared/types';

export type { JobListItem, JobDetail, JobsResponse };

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
