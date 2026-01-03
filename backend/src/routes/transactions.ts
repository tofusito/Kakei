import { Elysia, t } from 'elysia';
import { db } from '../db';
import { transactions, categories } from '../../database/schema';
import { eq, desc, and, count } from 'drizzle-orm';
import { buildDateCondition, type DateFilterQuery } from '../utils/dateFilters';

export const transactionRoutes = new Elysia({ prefix: '/api' })
    .get('/categories', async () => {
        return await db.select().from(categories);
    })
    .get('/history', async ({ query }) => {
        const dateCondition = buildDateCondition(query as DateFilterQuery);
        const classification = (query as any).classification;
        const page = parseInt((query as any).page) || 1;
        const limit = parseInt((query as any).limit) || 10;
        const offset = (page - 1) * limit;

        // Build where clause combining date and classification filters
        let whereClause = dateCondition;
        
        if (classification && classification !== 'all') {
            whereClause = whereClause 
                ? and(whereClause, eq(transactions.classification, classification))
                : eq(transactions.classification, classification);
        }

        // Get total count for pagination
        const [countResult] = await db.select({ total: count() })
            .from(transactions)
            .leftJoin(categories, eq(transactions.categoryId, categories.id))
            .where(whereClause);

        const total = countResult?.total || 0;

        // Get paginated data
        const data = await db.select({
            id: transactions.id,
            categoryId: transactions.categoryId,
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
            .limit(limit)
            .offset(offset);

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    })
    .post('/transactions', async ({ body }) => {
        const { categoryId, amount, note, classification, createdAt } = body;

        await db.insert(transactions).values({
            categoryId,
            amount: String(amount),
            note,
            classification: classification as any,
            createdAt: createdAt ? new Date(createdAt) : undefined,
        });

        return { success: true };
    }, {
        body: t.Object({
            categoryId: t.Number(),
            amount: t.Number(),
            note: t.String(),
            classification: t.Optional(t.Union([t.String(), t.Null()])),
            createdAt: t.Optional(t.String())
        })
    })
    .put('/transactions/:id', async ({ params, body }) => {
        const { id } = params;
        const { categoryId, amount, note, classification, createdAt } = body;

        await db.update(transactions)
            .set({
                categoryId,
                amount: String(amount),
                note,
                classification: classification as any,
                createdAt: createdAt ? new Date(createdAt) : undefined,
            })
            .where(eq(transactions.id, parseInt(id)));

        return { success: true };
    }, {
        params: t.Object({
            id: t.String()
        }),
        body: t.Object({
            categoryId: t.Number(),
            amount: t.Number(),
            note: t.String(),
            classification: t.Optional(t.Union([t.String(), t.Null()])),
            createdAt: t.Optional(t.String())
        })
    })
    .delete('/transactions/:id', async ({ params }) => {
        const { id } = params;

        await db.delete(transactions)
            .where(eq(transactions.id, parseInt(id)));

        return { success: true };
    }, {
        params: t.Object({
            id: t.String()
        })
    });
