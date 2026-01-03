import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import clsx from 'clsx';
import { formatCurrency } from '../lib/formatters';
import type { DashboardData, ClassificationBreakdown } from '../types';

interface StatusCardProps {
    dashboard: DashboardData;
    breakdown: ClassificationBreakdown;
    onBreakdownClick: () => void;
    isDarkMode: boolean;
}

import { ExpenseRing } from './ExpenseRing';

export function StatusCard({ dashboard, breakdown, onBreakdownClick, isDarkMode }: StatusCardProps) {
    return (
        <section className="mb-8">
            <div className={clsx(
                "rounded-xl border p-6 relative overflow-hidden",
                isDarkMode
                    ? "bg-[#050505] border-zinc-900 text-zinc-200"
                    : "bg-white border-zinc-200"
            )}>
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                        <span className={clsx(
                            "text-[10px] uppercase tracking-[0.2em] font-bold",
                            isDarkMode ? "text-zinc-500" : "text-zinc-400"
                        )}>
                            Status
                        </span>
                        {/* Expense Ring - click to show breakdown */}
                        <ExpenseRing
                            survival={breakdown.survival}
                            quality={breakdown.quality}
                            pleasure={breakdown.pleasure}
                            waste={breakdown.waste}
                            onClick={onBreakdownClick}
                            isDarkMode={isDarkMode}
                        />
                    </div>

                    <div className="mb-8">
                        <div className={clsx("text-4xl font-bold tracking-tighter tabular-nums", {
                            "text-emerald-500": dashboard.balance > 0,
                            "text-rose-600": dashboard.balance < 0,
                            [isDarkMode ? "text-zinc-400" : "text-zinc-900"]: dashboard.balance === 0
                        })}>
                            {formatCurrency(dashboard.balance)}
                        </div>
                    </div>

                    <div className="h-20 w-full mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dashboard.chartData}>
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke={isDarkMode ? "#f43f5e" : "#e11d48"}
                                    strokeWidth={2}
                                    fill={isDarkMode ? "#881337" : "#fecdd3"}
                                    isAnimationActive={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className={clsx(
                        "grid grid-cols-3 gap-4 pt-6 border-t",
                        isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"
                    )}>
                        <div>
                            <span className={clsx(
                                "text-[9px] uppercase tracking-wider block mb-1",
                                isDarkMode ? "text-zinc-600" : "text-zinc-400"
                            )}>
                                Income
                            </span>
                            <span className={clsx(
                                "text-sm font-bold tabular-nums block",
                                isDarkMode ? "text-zinc-200" : "text-zinc-900"
                            )}>
                                +{formatCurrency(dashboard.income)}
                            </span>
                        </div>
                        <div>
                            <span className={clsx(
                                "text-[9px] uppercase tracking-wider block mb-1",
                                isDarkMode ? "text-zinc-600" : "text-zinc-400"
                            )}>
                                Expenses
                            </span>
                            <span className={clsx(
                                "text-sm font-bold tabular-nums block",
                                isDarkMode ? "text-zinc-200" : "text-zinc-900"
                            )}>
                                {formatCurrency(dashboard.expenses)}
                            </span>
                        </div>
                        <div>
                            <span className={clsx(
                                "text-[9px] uppercase tracking-wider block mb-1",
                                isDarkMode ? "text-zinc-600" : "text-zinc-400"
                            )}>
                                Investment
                            </span>
                            <span className={clsx(
                                "text-sm font-bold tabular-nums block",
                                isDarkMode ? "text-zinc-200" : "text-zinc-900"
                            )}>
                                {formatCurrency(dashboard.investments)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
