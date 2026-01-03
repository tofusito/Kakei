import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { categories, users } from './schema';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

const DEFAULT_CATEGORIES = [
    // Income
    { name: 'Salary', icon: 'Wallet', type: 'income' },
    { name: 'Gifts Received', icon: 'Gift', type: 'income' },
    { name: 'Refunds', icon: 'Repeat', type: 'income' },

    // Investment
    { name: 'Index Funds', icon: 'TrendingUp', type: 'investment' },
    { name: 'ETFs', icon: 'BarChart3', type: 'investment' },
    { name: 'Savings', icon: 'Landmark', type: 'investment' },

    // Expense
    { name: 'Housing', icon: 'Home', type: 'expense' },
    { name: 'Groceries', icon: 'ShoppingCart', type: 'expense' },
    { name: 'Transport', icon: 'Train', type: 'expense' },
    { name: 'Subscriptions', icon: 'Cloud', type: 'expense' },
    { name: 'Services', icon: 'Activity', type: 'expense' },
    { name: 'Health', icon: 'Pill', type: 'expense' },
    { name: 'Leisure', icon: 'PartyPopper', type: 'expense' },
    { name: 'Shopping', icon: 'Package', type: 'expense' },
    { name: 'Gifts Given', icon: 'Heart', type: 'expense' },
    { name: 'Other', icon: 'Settings', type: 'expense' },
] as const;

export async function runSeed() {
    console.log('🌱 Seeding database...');

    try {
        // Optional: Check if already seeded to avoid unnecessary truncates on restart
        const count = await db.select({ count: categories.id }).from(categories);
        if (count.length > 0) {
            console.log('Database already seeded, skipping.');
            return;
        }

        await client`TRUNCATE TABLE categories CASCADE`;
    } catch (e) {
        console.log('Could not truncate or check, moving on...');
    }

    // Seed default user
    await db.insert(users).values({
        username: 'admin',
        passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$DnF1/dZf9Yg$TjS+9q/8...' // Placeholder hash
    }).onConflictDoNothing();

    for (const cat of DEFAULT_CATEGORIES) {
        await db.insert(categories).values(cat).onConflictDoNothing();
    }

    console.log('✅ Seeding completed');
}
