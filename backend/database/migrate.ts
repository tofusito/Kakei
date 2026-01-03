import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import path from 'path';

const migrationClient = postgres(process.env.DATABASE_URL!, { max: 1 });
const db = drizzle(migrationClient);

export async function runMigrations() {
    console.log('⏳ Running migrations...');
    // In Docker, the backend is copied to /app, so migrations are at ./database/drizzle
    const migrationPath = path.join(process.cwd(), 'database', 'drizzle');
    console.log(`Migration path: ${migrationPath}`);

    await migrate(db, { migrationsFolder: './database/drizzle' });
    console.log('✅ Migrations completed');
}
