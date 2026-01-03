import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { getWeekNumber } from '../lib/formatters';
import type { Transaction, FilterType, Classification } from '../types';

interface UseTransactionsProps {
    refreshDashboard: (params: URLSearchParams) => Promise<void>;
}

export function useTransactions({ refreshDashboard }: UseTransactionsProps) {
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

    // Filter state
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
    const [filterYear, setFilterYear] = useState(new Date().getFullYear());
    const [filterWeek, setFilterWeek] = useState(getWeekNumber(new Date()));
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');

    const [showFilterMenu, setShowFilterMenu] = useState(false);

    /**
     * Build URLSearchParams based on current filter state
     */
    const getFilterParams = useCallback(() => {
        const params = new URLSearchParams();
        if (filterType !== 'all') {
            params.append('filterType', filterType);
            if (filterType === 'week') {
                params.append('week', String(filterWeek));
                params.append('year', String(filterYear));
            } else if (filterType === 'month') {
                params.append('month', String(filterMonth));
                params.append('year', String(filterYear));
            } else if (filterType === 'year') {
                params.append('year', String(filterYear));
            } else if (filterType === 'range' && filterStartDate && filterEndDate) {
                params.append('startDate', filterStartDate);
                params.append('endDate', filterEndDate);
            }
        }
        return params;
    }, [filterType, filterWeek, filterYear, filterMonth, filterStartDate, filterEndDate]);

    /**
     * Fetch transactions and refresh dashboard
     */
    const fetchData = useCallback(async () => {
        try {
            const params = getFilterParams();
            const histRes = await axios.get(`/history?${params.toString()}`);
            setRecentTransactions(histRes.data);

            // Trigger dashboard refresh with same params
            await refreshDashboard(params);
        } catch (e) {
            console.error("Fetch transactions error", e);
        }
    }, [getFilterParams, refreshDashboard]);

    // Initial fetch and fetch on filter change
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    /**
     * Add a new transaction
     */
    const addTransaction = async (
        categoryId: number,
        amount: number,
        note: string,
        classification: Classification | null
    ) => {
        try {
            await axios.post('/transactions', {
                categoryId,
                amount,
                note,
                classification
            });
            await fetchData(); // Refresh everything
        } catch (e) {
            console.error("Add transaction error", e);
        }
    };

    return {
        recentTransactions,
        addTransaction,
        filters: {
            filterType, setFilterType,
            filterMonth, setFilterMonth,
            filterYear, setFilterYear,
            filterWeek, setFilterWeek,
            filterStartDate, setFilterStartDate,
            filterEndDate, setFilterEndDate,
            showFilterMenu, setShowFilterMenu
        },
        refreshData: fetchData
    };
}
