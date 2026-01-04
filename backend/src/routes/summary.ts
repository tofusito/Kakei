import { Elysia, t } from 'elysia';
import { db } from '../db';
import { transactions, categories } from '../../database/schema';
import { eq, sum, and, gte, lte, desc, sql } from 'drizzle-orm';

export const summaryRoutes = new Elysia({ prefix: '/api' })
    .get('/summary', async ({ query }) => {
        const { period, startDate: customStart, endDate: customEnd } = query as { 
            period?: string; 
            startDate?: string; 
            endDate?: string; 
        };
        
        // Calculate start and end dates based on period
        let startDate = new Date();
        let endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
        
        switch (period || 'month') {
            case 'week':
                // Start of current week (Monday)
                const dayOfWeek = startDate.getDay();
                const diff = startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                startDate.setDate(diff);
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'month':
                startDate.setDate(1);
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'year':
                startDate.setFullYear(startDate.getFullYear(), 0, 1);
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'custom':
                if (customStart && customEnd) {
                    startDate = new Date(customStart);
                    startDate.setHours(0, 0, 0, 0);
                    endDate = new Date(customEnd);
                    endDate.setHours(23, 59, 59, 999);
                } else {
                    // Default to this month if no dates provided
                    startDate.setDate(1);
                    startDate.setHours(0, 0, 0, 0);
                }
                break;
            default:
                startDate.setDate(1);
                startDate.setHours(0, 0, 0, 0);
        }

        // Get expenses grouped by category
        const expensesByCategory = await db.select({
            categoryId: categories.id,
            categoryName: categories.name,
            categoryIcon: categories.icon,
            total: sum(transactions.amount).mapWith(Number)
        })
            .from(transactions)
            .innerJoin(categories, eq(transactions.categoryId, categories.id))
            .where(
                and(
                    gte(transactions.createdAt, startDate),
                    lte(transactions.createdAt, endDate),
                    eq(categories.type, 'expense')
                )
            )
            .groupBy(categories.id, categories.name, categories.icon)
            .orderBy(desc(sum(transactions.amount)));

        // Calculate total expenses for percentage calculation
        const totalExpenses = expensesByCategory.reduce((acc, item) => acc + (item.total || 0), 0);

        // Format response with percentages
        const categoryBreakdown = expensesByCategory
            .filter(item => item.total && item.total > 0)
            .map(item => ({
                id: item.categoryId,
                name: item.categoryName,
                icon: item.categoryIcon,
                amount: item.total || 0,
                percentage: totalExpenses > 0 ? Math.round(((item.total || 0) / totalExpenses) * 100) : 0
            }));

        return {
            totalExpenses,
            period,
            categories: categoryBreakdown
        };
    });

