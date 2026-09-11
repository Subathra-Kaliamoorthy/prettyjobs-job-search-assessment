import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * Build a Drizzle client. Called per-request inside the Worker: bindings are
 * only available on the request context, never at module scope.
 */
export const makeDb = (url: string) => drizzle(neon(url), { schema });

export type Db = ReturnType<typeof makeDb>;
