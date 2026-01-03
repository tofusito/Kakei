import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { getWeekNumber } from '../lib/formatters';
import type { Transaction, FilterType, Classification } from '../types';

interface UseTransactionsProps {
    refreshDashboard: (params: URLSearchParams) => Promise<void>;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export function useTransactions({ refreshDashboard }: UseTransactionsProps) {
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    // Filter state
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
    const [filterYear, setFilterYear] = useState(new Date().getFullYear());
    const [filterWeek, setFilterWeek] = useState(getWeekNumber(new Date()));
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [classificationFilter, setClassificationFilter] = useState<Classification | 'all'>('all');

    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [showClassificationMenu, setShowClassificationMenu] = useState(false);

    /**
     * Build URLSearchParams based on current filter state
     */
    const getFilterParams = useCallback((page: number = 1) => {
        const params = new URLSearchParams();
        params.append('page', String(page));
        params.append('limit', '10');
        
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
        if (classificationFilter !== 'all') {
            params.append('classification', classificationFilter);
        }
        return params;
    }, [filterType, filterWeek, filterYear, filterMonth, filterStartDate, filterEndDate, classificationFilter]);

    /**
     * Fetch transactions and refresh dashboard
     */
    const fetchData = useCallback(async (page: number = 1) => {
        try {
            const params = getFilterParams(page);
            const histRes = await axios.get(`/history?${params.toString()}`);
            setRecentTransactions(histRes.data.data);
            setPagination(histRes.data.pagination);

            // Trigger dashboard refresh with same params (without pagination)
            const dashboardParams = new URLSearchParams(params);
            dashboardParams.delete('page');
            dashboardParams.delete('limit');
            await refreshDashboard(dashboardParams);
        } catch (e) {
            console.error("Fetch transactions error", e);
        }
    }, [getFilterParams, refreshDashboard]);

    // Initial fetch and fetch on filter change
    useEffect(() => {
        fetchData(1); // Reset to page 1 when filters change
    }, [filterType, filterWeek, filterYear, filterMonth, filterStartDate, filterEndDate, classificationFilter]);

    /**
     * Go to specific page
     */
    const goToPage = (page: number) => {
        if (page >= 1 && page <= pagination.totalPages) {
            fetchData(page);
        }
    };

    /**
     * Add a new transaction
     */
    const addTransaction = async (
        categoryId: number,
        amount: number,
        note: string,
        classification: Classification | null,
        createdAt?: string
    ) => {
        try {
            await axios.post('/transactions', {
                categoryId,
                amount,
                note,
                classification,
                createdAt
            });
            await fetchData(1); // Go back to page 1 after adding
        } catch (e) {
            console.error("Add transaction error", e);
        }
    };

    /**
     * Update a transaction
     */
    const updateTransaction = async (
        id: number,
        categoryId: number,
        amount: number,
        note: string,
        classification: Classification | null,
        createdAt?: string
    ) => {
        try {
            await axios.put(`/transactions/${id}`, {
                categoryId,
                amount,
                note,
                classification,
                createdAt
            });
            await fetchData(pagination.page); // Stay on current page
        } catch (e) {
            console.error("Update transaction error", e);
        }
    };

    /**
     * Delete a transaction
     */
    const deleteTransaction = async (id: number) => {
        try {
            await axios.delete(`/transactions/${id}`);
            await fetchData(pagination.page); // Stay on current page
        } catch (e) {
            console.error("Delete transaction error", e);
        }
    };

    return {
        recentTransactions,
        pagination,
        goToPage,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        filters: {
            filterType, setFilterType,
            filterMonth, setFilterMonth,
            filterYear, setFilterYear,
            filterWeek, setFilterWeek,
            filterStartDate, setFilterStartDate,
            filterEndDate, setFilterEndDate,
            showFilterMenu, setShowFilterMenu,
            classificationFilter, setClassificationFilter,
            showClassificationMenu, setShowClassificationMenu
        },
        refreshData: () => fetchData(pagination.page)
    };
}
