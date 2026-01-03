import { Elysia, t } from 'elysia';
import { db } from '../db';
import { transactions, categories } from '../../database/schema';
import { eq, sum, and, gte, sql } from 'drizzle-orm';
import { buildDateCondition, type DateFilterQuery } from '../utils/dateFilters';

export const dashboardRoutes = new Elysia({ prefix: '/api' })
    .get('/dashboard', async () => {
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
    .get('/classification-breakdown', async ({ query }) => {
        const dateCondition = buildDateCondition(query as DateFilterQuery);

        // Get only expenses with classifications
        const expenseCondition = eq(categories.type, 'expense');
        const whereClause = dateCondition
            ? and(dateCondition, expenseCondition)
            : expenseCondition;

        const breakdown = await db.select({
            classification: transactions.classification,
            total: sum(transactions.amount).mapWith(Number)
        })
            .from(transactions)
            .leftJoin(categories, eq(transactions.categoryId, categories.id))
            .where(whereClause)
            .groupBy(transactions.classification);

        // Format response with all 4 types, even if 0
        const result = {
            survival: 0,
            quality: 0,
            pleasure: 0,
            waste: 0
        };

        breakdown.forEach(item => {
            if (item.classification && item.total) {
                result[item.classification as keyof typeof result] = item.total;
            }
        });

        return result;
    });
