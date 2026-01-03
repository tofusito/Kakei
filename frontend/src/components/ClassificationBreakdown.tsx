import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import type { ClassificationBreakdown } from '../types';

interface ClassificationBreakdownProps {
    data: ClassificationBreakdown;
    isDarkMode: boolean;
    onClose?: () => void;
    isModal?: boolean;
}

export function ClassificationBreakdown({ data, isDarkMode, onClose, isModal = false }: ClassificationBreakdownProps) {
    const { t } = useTranslation();

    const items = [
        { id: 'survival', label: t('breakdown.survival'), value: data.survival, color: isDarkMode ? 'bg-emerald-500' : 'bg-emerald-600' },
        { id: 'quality', label: t('breakdown.quality'), value: data.quality, color: isDarkMode ? 'bg-blue-500' : 'bg-blue-600' },
        { id: 'pleasure', label: t('breakdown.pleasure'), value: data.pleasure, color: isDarkMode ? 'bg-amber-500' : 'bg-amber-600' },
        { id: 'waste', label: t('breakdown.waste'), value: data.waste, color: isDarkMode ? 'bg-rose-500' : 'bg-rose-600' }
    ];

    const total = data.survival + data.quality + data.pleasure + data.waste;

    return (
        <section className={clsx(!isModal && "mb-8")}>
            <div className={clsx(
                "border rounded-md shadow-sm",
                isModal ? "p-6" : "p-4",
                isDarkMode
                    ? "border-zinc-900 bg-[#050505]"
                    : "border-zinc-200 bg-zinc-50"
            )}>
                <div className={clsx("flex items-center justify-between", isModal ? "mb-5" : "mb-3")}>
                    <span className={clsx(
                        "font-black uppercase tracking-[0.2em] block",
                        isModal ? "text-[10px]" : "text-[9px]",
                        isDarkMode ? "text-zinc-500" : "text-zinc-500"
                    )}>
                        {t('breakdown.header')}
                    </span>
                    {isModal && onClose && (
                        <button
                            onClick={onClose}
                            className={clsx(
                                "p-2 -mr-2 transition-colors",
                                isDarkMode
                                    ? "text-zinc-400 hover:text-zinc-200"
                                    : "text-zinc-400 hover:text-zinc-600"
                            )}
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                <div className={clsx(isModal ? "space-y-4" : "space-y-2.5")}>
                    {items.map((item) => {
                        const percentage = total > 0 ? (item.value / total) * 100 : 0;

                        return (
                            <div key={item.id}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className={clsx(
                                        "text-[9px] font-black uppercase tracking-tight",
                                        isDarkMode ? "text-zinc-400" : "text-zinc-600"
                                    )}>
                                        {item.label}
                                    </span>
                                    <span className={clsx(
                                        "text-xs font-bold tabular-nums",
                                        isDarkMode ? "text-zinc-300" : "text-zinc-800"
                                    )}>
                                        {item.value.toFixed(0)}€ <span className={clsx("text-[9px] font-medium ml-1", isDarkMode ? "text-zinc-600" : "text-zinc-500")}>({percentage.toFixed(0)}%)</span>
                                    </span>
                                </div>
                                <div className={clsx(
                                    "h-2 rounded-full overflow-hidden",
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
