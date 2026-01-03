import clsx from 'clsx';
import { Filter, X, Clock } from 'lucide-react';
import type { FilterType, Classification } from '../types';

interface TransactionFiltersProps {
    filterType: FilterType;
    filterMonth: number;
    filterYear: number;
    filterWeek: number;
    showFilterMenu: boolean;
    setShowFilterMenu: (show: boolean) => void;
    onFilterChange: (type: FilterType) => void;
    classificationFilter: Classification | 'all';
    showClassificationMenu: boolean;
    setShowClassificationMenu: (show: boolean) => void;
    onClassificationChange: (classification: Classification | 'all') => void;
    isDarkMode: boolean;
}

export function TransactionFilters({
    filterType,
    showFilterMenu,
    setShowFilterMenu,
    onFilterChange,
    classificationFilter,
    showClassificationMenu,
    setShowClassificationMenu,
    onClassificationChange,
    isDarkMode
}: TransactionFiltersProps) {
    return (
        <div className="flex items-center justify-between mb-6 relative z-20">
            <span className={clsx(
                "text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2",
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
            )}>
                <History size={14} /> Transactions
            </span>
            <div className="flex items-center gap-2">
                {/* Time Filter */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setShowFilterMenu(!showFilterMenu);
                            setShowClassificationMenu(false);
                        }}
                        className={clsx(
                            "p-2 rounded-full transition-colors relative",
                            isDarkMode
                                ? "hover:bg-zinc-800 text-zinc-400"
                                : "hover:bg-zinc-100 text-zinc-400"
                        )}
                    >
                        {showFilterMenu ? <X size={16} /> : <Clock size={16} />}
                        {filterType !== 'all' && (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
                        )}
                    </button>

                    {showFilterMenu && (
                        <div className={clsx(
                            "absolute right-0 top-full mt-2 w-48 rounded-lg shadow-xl border overflow-hidden py-1 z-50",
                            isDarkMode
                                ? "bg-zinc-900 border-zinc-800"
                                : "bg-white border-zinc-200"
                        )}>
                            <div className={clsx("px-4 py-2 text-[10px] font-bold uppercase tracking-wider border-b", isDarkMode ? "border-zinc-800 text-zinc-500" : "border-zinc-100 text-zinc-400")}>
                                Time Period
                            </div>
                            {[
                                { id: 'all', label: 'All Time' },
                                { id: 'week', label: 'This Week' },
                                { id: 'month', label: 'This Month' },
                                { id: 'year', label: 'This Year' }
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => {
                                        onFilterChange(opt.id as FilterType);
                                        setShowFilterMenu(false);
                                    }}
                                    className={clsx(
                                        "w-full text-left px-4 py-3 text-xs font-medium transition-colors hover:bg-opacity-50",
                                        filterType === opt.id
                                            ? (isDarkMode ? "bg-zinc-800 text-white" : "bg-zinc-50 text-black")
                                            : (isDarkMode ? "text-zinc-400 hover:bg-zinc-800" : "text-zinc-600 hover:bg-zinc-50")
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Classification Filter */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setShowClassificationMenu(!showClassificationMenu);
                            setShowFilterMenu(false);
                        }}
                        className={clsx(
                            "p-2 rounded-full transition-colors relative",
                            isDarkMode
                                ? "hover:bg-zinc-800 text-zinc-400"
                                : "hover:bg-zinc-100 text-zinc-400"
                        )}
                    >
                        {showClassificationMenu ? <X size={16} /> : <Filter size={16} />}
                        {classificationFilter !== 'all' && (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
                        )}
                    </button>

                    {showClassificationMenu && (
                        <div className={clsx(
                            "absolute right-0 top-full mt-2 w-48 rounded-lg shadow-xl border overflow-hidden py-1 z-50",
                            isDarkMode
                                ? "bg-zinc-900 border-zinc-800"
                                : "bg-white border-zinc-200"
                        )}>
                            <div className={clsx("px-4 py-2 text-[10px] font-bold uppercase tracking-wider border-b", isDarkMode ? "border-zinc-800 text-zinc-500" : "border-zinc-100 text-zinc-400")}>
                                Expense Type
                            </div>
                            {[
                                { id: 'all', label: 'All Types' },
                                { id: 'survival', label: 'Vital', color: 'text-emerald-500' },
                                { id: 'quality', label: 'Useful', color: 'text-blue-500' },
                                { id: 'pleasure', label: 'Treat', color: 'text-amber-500' },
                                { id: 'waste', label: 'Waste', color: 'text-rose-500' }
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => {
                                        onClassificationChange(opt.id as Classification | 'all');
                                        setShowClassificationMenu(false);
                                    }}
                                    className={clsx(
                                        "w-full text-left px-4 py-3 text-xs font-medium transition-colors hover:bg-opacity-50 flex items-center gap-2",
                                        classificationFilter === opt.id
                                            ? (isDarkMode ? "bg-zinc-800 text-white" : "bg-zinc-50 text-black")
                                            : (isDarkMode ? "text-zinc-400 hover:bg-zinc-800" : "text-zinc-600 hover:bg-zinc-50")
                                    )}
                                >
                                    {opt.id !== 'all' && (
                                        <span className={clsx("w-2 h-2 rounded-full", opt.color?.replace('text-', 'bg-'))}></span>
                                    )}
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Simple History icon component since it was missing before
function History({ size = 18, className = "" }: { size?: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74-2.74L3 12" />
            <path d="M3 3v9h9" />
            <path d="M12 7v5l4 2" />
        </svg>
    );
}
