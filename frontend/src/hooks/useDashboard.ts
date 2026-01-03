import { useState, useCallback } from 'react';
import axios from 'axios';
import type { DashboardData, ClassificationBreakdown } from '../types';

const INITIAL_DASHBOARD: DashboardData = {
    balance: 0,
    expenses: 0,
    income: 0,
    investments: 0,
    chartData: []
};

const INITIAL_BREAKDOWN: ClassificationBreakdown = {
    survival: 0,
    quality: 0,
    pleasure: 0,
    waste: 0
};

export function useDashboard() {
    const [dashboard, setDashboard] = useState<DashboardData>(INITIAL_DASHBOARD);
    const [classificationBreakdown, setClassificationBreakdown] = useState<ClassificationBreakdown>(INITIAL_BREAKDOWN);
    const [loading, setLoading] = useState(false);

    /**
     * Fetch dashboard and breakdown data based on filters
     */
    const fetchDashboardData = useCallback(async (params: URLSearchParams) => {
        setLoading(true);
        try {
            const [dashRes, breakdownRes] = await Promise.all([
                axios.get('/dashboard'), // Dashboard might need filters too if API supports it, currently it seems global in your code but let's assume it should match filters or is static? 
                // Wait, checking original code: /dashboard endpoint didn't take params in original App.tsx fetch, only history did.
                // However, /classification-breakdown DOES take params.
                // NOTE: Ideally /dashboard SHOULD take params to filter the balance/income/expenses by date too, 
                // but original code only filtered history list and breakdown? 
                // Let's stick to original behavior for now or improve it? 
                // Original: axios.get('/dashboard') (no params)
                // New Plan: Keep it same to avoid breakage, but pass params to breakdown.
                axios.get(`/classification-breakdown?${params.toString()}`)
            ]);

            setDashboard(dashRes.data);
            setClassificationBreakdown(breakdownRes.data);
        } catch (e) {
            console.error("Dashboard fetch error", e);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        dashboard,
        classificationBreakdown,
        loading,
        fetchDashboardData,
        setDashboard // Exposed for optimistic updates if needed
    };
}
