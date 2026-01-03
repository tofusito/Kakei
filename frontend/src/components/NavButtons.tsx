import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';
import type { TransactionType } from '../types';

interface NavButtonsProps {
    onOpenQuickAdd: (type: TransactionType) => void;
    isDarkMode: boolean;
}

export function NavButtons({ onOpenQuickAdd, isDarkMode }: NavButtonsProps) {
    const { t } = useTranslation();
    return (
        <section className="grid grid-cols-3 gap-3 mb-12">
            <button
                onClick={() => onOpenQuickAdd('expense')}
                className={clsx(
                    "flex flex-col items-center justify-center p-4 rounded-xl border transition-all active:scale-95",
                    isDarkMode
                        ? "bg-zinc-900/50 border-zinc-800 text-zinc-200 hover:bg-zinc-900 hover:border-zinc-700"
                        : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300"
                )}
            >
                <div className={clsx(
                    "mb-2 p-2 rounded-full",
                    isDarkMode ? "bg-rose-900/30 text-rose-400" : "bg-rose-100 text-rose-600"
                )}>
                    <ArrowDown size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">{t('nav.expense')}</span>
            </button>

            <button
                onClick={() => onOpenQuickAdd('income')}
                className={clsx(
                    "flex flex-col items-center justify-center p-4 rounded-xl border transition-all active:scale-95",
                    isDarkMode
                        ? "bg-zinc-900/50 border-zinc-800 text-zinc-200 hover:bg-zinc-900 hover:border-zinc-700"
                        : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300"
                )}
            >
                <div className={clsx(
                    "mb-2 p-2 rounded-full",
                    isDarkMode ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-100 text-emerald-600"
                )}>
                    <ArrowUp size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">{t('nav.income')}</span>
            </button>

            <button
                onClick={() => onOpenQuickAdd('investment')}
                className={clsx(
                    "flex flex-col items-center justify-center p-4 rounded-xl border transition-all active:scale-95",
                    isDarkMode
                        ? "bg-zinc-900/50 border-zinc-800 text-zinc-200 hover:bg-zinc-900 hover:border-zinc-700"
                        : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300"
                )}
            >
                <div className={clsx(
                    "mb-2 p-2 rounded-full",
                    isDarkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"
                )}>
                    <TrendingUp size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">{t('nav.invest')}</span>
            </button>
        </section>
    );
}
