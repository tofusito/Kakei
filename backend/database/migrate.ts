import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import path from 'path';

const migrationClient = postgres(process.env.DATABASE_URL!, { max: 1 });
const db = drizzle(migrationClient);

export async function runMigrations() {
    console.log('⏳ Running migrations...');
    // In Docker, files are in /app/backend/database/drizzle, and we run from /app
    // We need to be robust about path finding.
    const migrationPath = path.join(process.cwd(), 'backend', 'database', 'drizzle');
    console.log(`Migration path: ${migrationPath}`);

    // Fallback if that path doesn't exist (local dev vs docker)
    // Actually, drizzle-kit migrate expects relative path or absolute.
    // Let's rely on relative path from where we run (root of project in docker /app)

    await migrate(db, { migrationsFolder: './backend/database/drizzle' });
    console.log('✅ Migrations completed');
}
