import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users, categories, transactions, userSettings } from '../database/schema';

const dbUrl = process.env.DATABASE_URL!;
const client = postgres(dbUrl);

export const db = drizzle(client, { schema: { users, categories, transactions, userSettings } });
