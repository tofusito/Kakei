// Centralized TypeScript types for Kakei app

export interface Transaction {
    id: number;
    categoryId?: number;
    amount: string;
    note: string | null;
    classification: Classification | null;
    createdAt: string;
    category: string;
    icon: string;
    type: TransactionType;
}

export interface Category {
    id: number;
    name: string;
    icon: string;
    type: TransactionType;
}

export interface ChartPoint {
    name: string;
    amount: number;
}

export interface DashboardData {
    balance: number;
    expenses: number;
    income: number;
    investments: number;
    chartData: ChartPoint[];
}

export interface ClassificationBreakdown {
    survival: number;
    quality: number;
    pleasure: number;
    waste: number;
}

export type TransactionType = 'income' | 'expense' | 'investment';
export type Classification = 'survival' | 'quality' | 'pleasure' | 'waste';
export type Theme = 'light' | 'dark';
export type FilterType = 'week' | 'month' | 'year' | 'range' | 'all';
