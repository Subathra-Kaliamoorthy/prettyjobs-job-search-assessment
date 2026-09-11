import { sql } from 'drizzle-orm';
import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

/**
 * The nine fields named in the assessment brief, plus a surrogate key.
 * "Salary range" is modelled as the salary_min/salary_max pair.
 */
export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  company: text('company').notNull(),
  location: text('location').notNull(),
  jobType: text('job_type').notNull(),
  salaryMin: integer('salary_min').notNull(),
  salaryMax: integer('salary_max').notNull(),
  experienceLevel: text('experience_level').notNull(),
  skills: text('skills').array().notNull().default(sql`'{}'::text[]`),
  description: text('description').notNull(),
  postedAt: timestamp('posted_at', { withTimezone: true }).notNull(),
});

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
