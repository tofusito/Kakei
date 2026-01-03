import { Elysia, t } from 'elysia';
import { db } from '../db';
import { transactions, categories } from '../../database/schema';
import { eq, desc, and } from 'drizzle-orm';
import { buildDateCondition, type DateFilterQuery } from '../utils/dateFilters';

export const transactionRoutes = new Elysia({ prefix: '/api' })
    .get('/categories', async () => {
        return await db.select().from(categories);
    })
    .get('/history', async ({ query }) => {
        const dateCondition = buildDateCondition(query as DateFilterQuery);
        const classification = (query as any).classification;

        // Build where clause combining date and classification filters
        let whereClause = dateCondition;
        
        if (classification && classification !== 'all') {
            whereClause = whereClause 
                ? and(whereClause, eq(transactions.classification, classification))
                : eq(transactions.classification, classification);
        }

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
            .limit(50);
    })
    .post('/transactions', async ({ body }) => {
        const { categoryId, amount, note, classification, createdAt } = body;

        await db.insert(transactions).values({
            categoryId,
            amount: String(amount),
            note,
            classification: classification as any, // Enum type cast
            createdAt: createdAt ? new Date(createdAt) : undefined, // Use provided date or default to now()
        });

        return { success: true };
    }, {
        body: t.Object({
            categoryId: t.Number(),
            amount: t.Number(),
            note: t.String(),
            classification: t.Optional(t.Union([t.String(), t.Null()])),
            createdAt: t.Optional(t.String()) // ISO date string
        })
    });
