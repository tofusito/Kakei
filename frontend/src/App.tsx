import { useState, useEffect } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import { QuickAdd } from './components/QuickAdd';
import { StatusCard } from './components/StatusCard';
import { ClassificationBreakdown } from './components/ClassificationBreakdown';
import { NavButtons } from './components/NavButtons';
import { TransactionFilters } from './components/TransactionFilters';
import { TransactionList } from './components/TransactionList';
import { ThemeDropdown } from './components/ThemeDropdown';

import { useTheme } from './hooks/useTheme';
import { useDashboard } from './hooks/useDashboard';
import { useTransactions } from './hooks/useTransactions';

import type { Category, TransactionType } from './types';

// Setup axios defaults
axios.defaults.baseURL = '/api';

function App() {
    // Custom Hooks
    const { theme, setTheme, isDarkMode, showThemeMenu, setShowThemeMenu } = useTheme();
    const { dashboard, classificationBreakdown, fetchDashboardData } = useDashboard();

    // Pass refreshDashboard to useTransactions so adding a transaction updates the dashboard
    const {
        recentTransactions,
        addTransaction,
        filters
    } = useTransactions({ refreshDashboard: fetchDashboardData });

    // Local state for UI only (modals, etc)
    const [categories, setCategories] = useState<Category[]>([]);
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [quickAddType, setQuickAddType] = useState<TransactionType>('expense');

    // Fetch categories on mount
    useEffect(() => {
        axios.get('/categories').then(res => setCategories(res.data)).catch(console.error);
    }, []);

    const handleOpenQuickAdd = (type: TransactionType) => {
        console.log('Opening QuickAdd for:', type);
        setQuickAddType(type);
        setShowQuickAdd(true);
    };

    return (
        <div className={clsx(
            "min-h-screen transition-colors duration-300 font-sans selection:bg-rose-500/30",
            isDarkMode ? "bg-black text-zinc-200" : "bg-zinc-50 text-zinc-900"
        )}>
            <div className="max-w-md mx-auto min-h-screen relative shadow-2xl overflow-hidden bg-opacity-50">

                {/* Header */}
                <header className="px-6 py-6 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
                    <div className="flex items-center gap-3">
                        <span className={clsx(
                            "text-xs font-black tracking-[0.3em] uppercase",
                            isDarkMode ? "text-zinc-100" : "text-zinc-900"
                        )}>
                            Kakei
                        </span>
                    </div>
                    <ThemeDropdown
                        theme={theme}
                        setTheme={setTheme}
                        showThemeMenu={showThemeMenu}
                        setShowThemeMenu={setShowThemeMenu}
                        isDarkMode={isDarkMode}
                    />
                </header>

                <main className="px-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">

                    <StatusCard dashboard={dashboard} isDarkMode={isDarkMode} />

                    <ClassificationBreakdown data={classificationBreakdown} isDarkMode={isDarkMode} />

                    <NavButtons onOpenQuickAdd={handleOpenQuickAdd} isDarkMode={isDarkMode} />

                    <section>
                        <TransactionFilters
                            filterType={filters.filterType}
                            filterMonth={filters.filterMonth}
                            filterYear={filters.filterYear}
                            filterWeek={filters.filterWeek}
                            showFilterMenu={filters.showFilterMenu}
                            setShowFilterMenu={filters.setShowFilterMenu}
                            onFilterChange={filters.setFilterType}
                            isDarkMode={isDarkMode}
                        />

                        <TransactionList transactions={recentTransactions} isDarkMode={isDarkMode} />
                    </section>
                </main>

                {/* Quick Add Modal */}
                {showQuickAdd && (
                    <QuickAdd
                        type={quickAddType}
                        categories={categories.filter(c => c.type === quickAddType)}
                        onAddTransaction={addTransaction}
                        onClose={() => setShowQuickAdd(false)}
                    />
                )}
            </div>
        </div>
    );
}

export default App;
