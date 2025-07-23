import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { join } from 'node:path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as schema from '@/models/Schema';
import { EnvServer } from './EnvServer';

// Stores the db connection in the global scope to prevent multiple instances due to hot reloading with Next.js
const globalForDb = globalThis as unknown as {
  drizzle: NodePgDatabase<typeof schema>;
};

// Need a database for production? Check out https://www.prisma.io/?via=nextjsboilerplate
// Tested and compatible with Next.js Boilerplate
const createDbConnection = () => {
  return drizzle({
    connection: {
      connectionString: EnvServer.DATABASE_URL,
      ssl: !EnvServer.DATABASE_URL.includes('localhost') && !EnvServer.DATABASE_URL.includes('127.0.0.1'),
    },
    schema,
  });
};

const db = globalForDb.drizzle || createDbConnection();

// Only store in global during development to prevent hot reload issues
if (EnvServer.NODE_ENV !== 'production') {
  globalForDb.drizzle = db;
}

// Run migrations lazily when needed
let migrationPromise: Promise<void> | null = null;

export const runMigrations = async () => {
  if (!migrationPromise) {
    migrationPromise = migrate(db, {
      migrationsFolder: join(process.cwd(), 'migrations'),
    });
  }
  return migrationPromise;
};

export { db };
