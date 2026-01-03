import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { jwt } from '@elysiajs/jwt';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users, categories, transactions } from '../database/schema';
import { eq, desc, sum, and, gte, lte, sql } from 'drizzle-orm';
import { runMigrations } from '../database/migrate';
import { runSeed } from '../database/seed';

const dbUrl = process.env.DATABASE_URL!;
const client = postgres(dbUrl);
const db = drizzle(client, { schema: { users, categories, transactions } });

const app = new Elysia()
    .use(cors())
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET || 'secret',
        })
    )
    .onError(({ code, error }) => {
        return new Response(JSON.stringify({ error: String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    })
    .onStart(async () => {
        try {
            console.log('🔄 Running Startup Database Init...');
            await runMigrations();
            await runSeed();
            console.log('✅ Startup Database Init Completed');
        } catch (e) {
            console.error('❌ Startup DB Init failed:', e);
        }

        const adminUser = process.env.ADMIN_USER || 'admin';
        const adminPass = process.env.ADMIN_PASS || 'admin';
        const hashedPassword = await Bun.password.hash(adminPass);

        const existing = await db.select().from(users).where(eq(users.username, adminUser));

        if (existing.length === 0) {
            await db.insert(users).values({ username: adminUser, passwordHash: hashedPassword });
        } else {
            await db.update(users).set({ passwordHash: hashedPassword }).where(eq(users.username, adminUser));
        }
    })
    .get('/api/dashboard', async () => {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const expenses = await db.select({
            total: sum(transactions.amount).mapWith(Number)
        })
            .from(transactions)
            .leftJoin(categories, eq(transactions.categoryId, categories.id))
            .where(
                and(
                    gte(transactions.createdAt, startOfMonth),
                    eq(categories.type, 'expense')
                )
            );

        const income = await db.select({
            total: sum(transactions.amount).mapWith(Number)
        })
            .from(transactions)
            .leftJoin(categories, eq(transactions.categoryId, categories.id))
            .where(
                and(
                    gte(transactions.createdAt, startOfMonth),
                    eq(categories.type, 'income')
                )
            );

        const investments = await db.select({
            total: sum(transactions.amount).mapWith(Number)
        })
            .from(transactions)
            .leftJoin(categories, eq(transactions.categoryId, categories.id))
            .where(
                and(
                    gte(transactions.createdAt, startOfMonth),
                    eq(categories.type, 'investment')
                )
            );

        const dailyData = await db.select({
            date: sql<string>`to_char(${transactions.createdAt}, 'DD')`,
            amount: sum(transactions.amount).mapWith(Number)
        })
            .from(transactions)
            .leftJoin(categories, eq(transactions.categoryId, categories.id))
            .where(
                and(
                    gte(transactions.createdAt, startOfMonth),
                    eq(categories.type, 'expense')
                )
            )
            .groupBy(sql`to_char(${transactions.createdAt}, 'DD')`)
            .orderBy(sql`to_char(${transactions.createdAt}, 'DD')`);

        const chartData = dailyData.map(d => ({
            name: d.date,
            amount: d.amount
        }));

        const totalIncome = income[0]?.total || 0;
        const totalExpenses = expenses[0]?.total || 0;
        const totalInvestments = investments[0]?.total || 0;

        return {
            balance: totalIncome - totalExpenses - totalInvestments,
            expenses: totalExpenses,
            income: totalIncome,
            investments: totalInvestments,
            chartData
        };
    })
    .get('/api/categories', async () => {
        return await db.select().from(categories);
    })
    .get('/api/history', async ({ query }) => {
        const { filterType, month, year, week, startDate, endDate } = query;

        // Build date filter conditions
        let dateCondition;

        if (filterType === 'month' && month && year) {
            const start = new Date(Number(year), Number(month) - 1, 1);
            const end = new Date(Number(year), Number(month), 0, 23, 59, 59);
            dateCondition = and(
                gte(transactions.createdAt, start),
                lte(transactions.createdAt, end)
            );
        } else if (filterType === 'year' && year) {
            const start = new Date(Number(year), 0, 1);
            const end = new Date(Number(year), 11, 31, 23, 59, 59);
            dateCondition = and(
                gte(transactions.createdAt, start),
                lte(transactions.createdAt, end)
            );
        } else if (filterType === 'week' && week && year) {
            // Calculate week start/end
            const weekNum = Number(week);
            const yearNum = Number(year);
            const start = new Date(yearNum, 0, 1 + (weekNum - 1) * 7);
            const dayOfWeek = start.getDay();
            start.setDate(start.getDate() - dayOfWeek + 1); // Monday
            const end = new Date(start);
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59);
            dateCondition = and(
                gte(transactions.createdAt, start),
                lte(transactions.createdAt, end)
            );
        } else if (filterType === 'range' && startDate && endDate) {
            const start = new Date(startDate as string);
            const end = new Date(endDate as string);
            end.setHours(23, 59, 59);
            dateCondition = and(
                gte(transactions.createdAt, start),
                lte(transactions.createdAt, end)
            );
        }

        const whereClause = dateCondition || undefined;

        return await db.select({
            id: transactions.id,
            amount: transactions.amount,
            note: transactions.note,
            classification: transactions.classification,
            createdAt: transactions.createdAt,
            category: categories.name,
            icon: categories.icon,
            type: categories.type
        })
            .from(transactions)
            .leftJoin(categories, eq(transactions.categoryId, categories.id))
            .where(whereClause)
            .orderBy(desc(transactions.createdAt))
            .limit(100);
    })
    .post('/api/transactions', async ({ body }) => {
        const { categoryId, amount, note, classification, userId } = body;
        let finalUserId = userId;
        if (!finalUserId) {
            const [u] = await db.select().from(users).limit(1);
            finalUserId = u.id;
        }

        if (!note || note.trim().length === 0) {
            throw new Error('Note is required');
        }

        await db.insert(transactions).values({
            categoryId,
            userId: finalUserId,
            amount: String(amount),
            note: note,
            classification: classification as 'survival' | 'quality' | 'pleasure' | 'waste' | null
        });

        return { success: true };
    }, {
        body: t.Object({
            categoryId: t.Numeric(),
            amount: t.Numeric(),
            note: t.String(),
            classification: t.Optional(t.Nullable(t.String())),
            userId: t.Optional(t.Numeric())
        })
    })
    // Serve static frontend files
    .get('/*', async ({ path }) => {
        const file = Bun.file(`./public${path}`);
        if (await file.exists()) return file;

        // Fallback to index.html for SPA routing
        if (!path.startsWith('/api')) {
            return Bun.file('./public/index.html');
        }
    })
    .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
