import clsx from 'clsx';
import type { ClassificationBreakdown } from '../types';

interface ClassificationBreakdownProps {
    data: ClassificationBreakdown;
    isDarkMode: boolean;
}

export function ClassificationBreakdown({ data, isDarkMode }: ClassificationBreakdownProps) {
    const items = [
        { id: 'survival', label: 'Vital', value: data.survival, color: isDarkMode ? 'bg-emerald-500' : 'bg-emerald-600' },
        { id: 'quality', label: 'Useful', value: data.quality, color: isDarkMode ? 'bg-blue-500' : 'bg-blue-600' },
        { id: 'pleasure', label: 'Treat', value: data.pleasure, color: isDarkMode ? 'bg-amber-500' : 'bg-amber-600' },
        { id: 'waste', label: 'Waste', value: data.waste, color: isDarkMode ? 'bg-rose-500' : 'bg-rose-600' }
    ];

    const total = data.survival + data.quality + data.pleasure + data.waste;

    return (
        <section className="mb-12">
            <div className={clsx(
                "border p-6 rounded-md shadow-sm",
                isDarkMode
                    ? "border-zinc-900 bg-[#050505]"
                    : "border-zinc-200 bg-zinc-50"
            )}>
                <div className="mb-5">
                    <span className={clsx(
                        "text-[10px] font-black uppercase tracking-[0.2em] block",
                        isDarkMode ? "text-zinc-500" : "text-zinc-600"
                    )}>
                        Expense Breakdown
                    </span>
                </div>

                <div className="space-y-4">
                    {items.map((item) => {
                        const percentage = total > 0 ? (item.value / total) * 100 : 0;

                        return (
                            <div key={item.id}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className={clsx(
                                        "text-[11px] font-black uppercase tracking-tight",
                                        isDarkMode ? "text-zinc-300" : "text-zinc-700"
                                    )}>
                                        {item.label}
                                    </span>
                                    <span className={clsx(
                                        "text-sm font-bold tabular-nums",
                                        isDarkMode ? "text-zinc-200" : "text-zinc-900"
                                    )}>
                                        {item.value.toFixed(0)}€ <span className={clsx("text-[11px] font-medium ml-1", isDarkMode ? "text-zinc-500" : "text-zinc-600")}>({percentage.toFixed(0)}%)</span>
                                    </span>
                                </div>
                                <div className={clsx(
                                    "h-3 rounded-full overflow-hidden",
                                    isDarkMode ? "bg-zinc-900" : "bg-zinc-200"
                                )}>
                                    <div
                                        className={clsx("h-full transition-all duration-500 rounded-full", item.color)}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
