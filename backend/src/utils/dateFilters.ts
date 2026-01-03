import { transactions } from '../../database/schema';
import { and, gte, lte } from 'drizzle-orm';

export interface DateFilterQuery {
    filterType?: 'week' | 'month' | 'year' | 'range' | 'all';
    month?: string;
    year?: string;
    week?: string;
    startDate?: string;
    endDate?: string;
}

export function buildDateCondition(query: DateFilterQuery) {
    const { filterType, month, year, week, startDate, endDate } = query;

    if (filterType === 'month' && month && year) {
        const start = new Date(Number(year), Number(month) - 1, 1);
        const end = new Date(Number(year), Number(month), 0, 23, 59, 59);
        return and(
            gte(transactions.createdAt, start),
            lte(transactions.createdAt, end)
        );
    } else if (filterType === 'year' && year) {
        const start = new Date(Number(year), 0, 1);
        const end = new Date(Number(year), 11, 31, 23, 59, 59);
        return and(
            gte(transactions.createdAt, start),
            lte(transactions.createdAt, end)
        );
    } else if (filterType === 'week' && week && year) {
        const weekNum = Number(week);
        const yearNum = Number(year);
        // Calculate start of week (ISO 8601 ish, but matching existing logic)
        const start = new Date(yearNum, 0, 1 + (weekNum - 1) * 7);
        const dayOfWeek = start.getDay();
        start.setDate(start.getDate() - dayOfWeek + 1);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59);
        return and(
            gte(transactions.createdAt, start),
            lte(transactions.createdAt, end)
        );
    } else if (filterType === 'range' && startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59);
        return and(
            gte(transactions.createdAt, start),
            lte(transactions.createdAt, end)
        );
    }

    return undefined; // No filter or 'all'
}
