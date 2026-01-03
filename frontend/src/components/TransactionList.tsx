import clsx from 'clsx';
import { DynamicIcon } from './shared/DynamicIcon';
import { formatCurrency, formatDate } from '../lib/formatters';
import type { Transaction } from '../types';

interface TransactionListProps {
    transactions: Transaction[];
    isDarkMode: boolean;
}

export function TransactionList({ transactions, isDarkMode }: TransactionListProps) {
    if (transactions.length === 0) {
        return (
            <div className={clsx(
                "text-center py-12 rounded-xl border border-dashed",
                isDarkMode
                    ? "border-zinc-800 text-zinc-600"
                    : "border-zinc-200 text-zinc-400"
            )}>
                <p className="text-xs font-medium">No transactions found</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 pb-20">
            {transactions.map((t) => (
                <div
                    key={t.id}
                    className={clsx(
                        "group flex items-center justify-between p-4 rounded-xl border transition-all hover:scale-[1.01] active:scale-[0.99]",
                        isDarkMode
                            ? "bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-900 hover:border-zinc-700"
                            : "bg-white border-zinc-100 hover:border-zinc-200 hover:shadow-sm"
                    )}
                >
                    <div className="flex items-center gap-4">
                        <div className={clsx(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                            isDarkMode ? "bg-zinc-800 group-hover:bg-zinc-700" : "bg-zinc-50 group-hover:bg-zinc-100"
                        )}>
                            <DynamicIcon
                                name={t.icon}
                                size={18}
                                className={isDarkMode ? "text-zinc-400" : "text-zinc-500"}
                            />
                        </div>
                        <div>
                            <p className={clsx(
                                "font-bold text-sm mb-0.5",
                                isDarkMode ? "text-zinc-200" : "text-zinc-900"
                            )}>
                                {t.category}
                            </p>
                            <div className="flex items-center gap-2">
                                <span className={clsx("text-[10px]", isDarkMode ? "text-zinc-500" : "text-zinc-500")}>
                                    {formatDate(t.createdAt)}
                                </span>
                                {t.note && (
                                    <>
                                        <span className="text-zinc-600">•</span>
                                        <span className="text-[10px] text-zinc-500 truncate max-w-[100px]">{t.note}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className={clsx(
                            "block font-bold tabular-nums text-sm",
                            t.type === 'expense'
                                ? (isDarkMode ? "text-zinc-200" : "text-zinc-900")
                                : t.type === 'income'
                                    ? "text-emerald-500"
                                    : "text-blue-500"
                        )}>
                            {t.type === 'expense' ? '-' : '+'}{formatCurrency(parseFloat(t.amount))}
                        </span>
                        {t.classification && (
                            <span className={clsx(
                                "text-[9px] font-medium uppercase tracking-wider",
                                t.classification === 'survival' ? "text-emerald-500" :
                                    t.classification === 'quality' ? "text-blue-500" :
                                        t.classification === 'pleasure' ? "text-amber-500" : "text-rose-500"
                            )}>
                                {t.classification === 'survival' ? 'Vital' :
                                    t.classification === 'quality' ? 'Useful' :
                                        t.classification === 'pleasure' ? 'Treat' : 'Waste'}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
