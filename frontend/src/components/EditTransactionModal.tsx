import { useState } from 'react';
import { X, Check, Zap, Star, Sparkles, Trash2, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { DynamicIcon } from './shared/DynamicIcon';
import type { Transaction, Category, Classification } from '../types';

interface EditTransactionModalProps {
    transaction: Transaction;
    categories: Category[];
    onSave: (id: number, categoryId: number, amount: number, note: string, classification: Classification | null, createdAt?: string) => Promise<void>;
    onClose: () => void;
    isDarkMode: boolean;
}

export function EditTransactionModal({
    transaction,
    categories: _categories, // Reserved for future category change feature
    onSave,
    onClose,
    isDarkMode
}: EditTransactionModalProps) {
    const { t } = useTranslation();
    const [amount, setAmount] = useState(transaction.amount);
    const [note, setNote] = useState(transaction.note || '');
    const [classification, setClassification] = useState<Classification | null>(transaction.classification as Classification || null);
    const [selectedDate, setSelectedDate] = useState(
        transaction.createdAt ? new Date(transaction.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    );
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [saving, setSaving] = useState(false);

    const isExpense = transaction.type === 'expense';
    const isValid = parseFloat(amount) > 0 && note.trim().length > 0 && (!isExpense || classification !== null);

    const handleSave = async () => {
        if (!isValid || saving) return;
        setSaving(true);
        try {
            await onSave(
                transaction.id,
                transaction.categoryId!,
                parseFloat(amount),
                note,
                classification,
                selectedDate
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={clsx(
            "fixed inset-0 backdrop-blur-md flex flex-col items-center justify-center p-6 z-[100] animate-in fade-in duration-200",
            isDarkMode ? "bg-black/90" : "bg-white/90"
        )}>
            <div className={clsx(
                "rounded-md p-8 w-full max-w-sm shadow-2xl relative",
                isDarkMode
                    ? "bg-black border border-zinc-900"
                    : "bg-white border border-zinc-200"
            )}>
                <div className="flex justify-between absolute top-4 left-4 right-4 font-sans">
                    <span className={clsx(
                        "text-[10px] font-black uppercase tracking-[0.2em]",
                        isDarkMode ? "text-zinc-500" : "text-zinc-600"
                    )}>
                        {t('common.edit')}
                    </span>
                    <button 
                        onClick={onClose} 
                        className={clsx(
                            "p-2 transition-colors",
                            isDarkMode
                                ? "text-zinc-700 hover:text-white"
                                : "text-zinc-400 hover:text-zinc-900"
                        )}
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="flex flex-col items-center mb-10 mt-4">
                    <div className={clsx("mb-3", isDarkMode ? "text-zinc-400" : "text-zinc-600")}>
                        <DynamicIcon name={transaction.icon} size={32} />
                    </div>
                    <h3 className={clsx(
                        "text-[10px] font-black tracking-[0.3em] uppercase",
                        isDarkMode ? "text-zinc-500" : "text-zinc-600"
                    )}>
                        {t(`categories.${transaction.category}`)}
                    </h3>
                </div>

                <div className="space-y-8">
                    <div className="relative">
                        <span className={clsx(
                            "absolute left-0 top-1/2 -translate-y-1/2 text-xl font-light",
                            isDarkMode ? "text-zinc-800" : "text-zinc-300"
                        )}>€</span>
                        <input
                            type="number"
                            inputMode="decimal"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className={clsx(
                                "w-full bg-transparent text-5xl font-bold text-center py-4 border-b focus:border-zinc-500 focus:ring-0 outline-none transition-all tabular-nums",
                                isDarkMode
                                    ? "border-zinc-900 text-white placeholder:text-zinc-900"
                                    : "border-zinc-200 text-zinc-900 placeholder:text-zinc-300"
                            )}
                            step="0.01"
                        />
                    </div>

                    <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder={t('quick_add.note')}
                        className={clsx(
                            "w-full bg-transparent border-b text-center text-xs font-medium py-2 focus:border-zinc-500 focus:ring-0 focus:outline-none transition-colors",
                            isDarkMode
                                ? "border-zinc-900 text-zinc-500 placeholder:text-zinc-900"
                                : "border-zinc-200 text-zinc-600 placeholder:text-zinc-400"
                        )}
                    />

                    <div className="space-y-6">
                        {isExpense && (
                            <div className="grid grid-cols-4 gap-1">
                                {[
                                    { id: 'survival', label: t('breakdown.survival'), Icon: Zap, color: 'emerald' },
                                    { id: 'quality', label: t('breakdown.quality'), Icon: Star, color: 'blue' },
                                    { id: 'pleasure', label: t('breakdown.pleasure'), Icon: Sparkles, color: 'amber' },
                                    { id: 'waste', label: t('breakdown.waste'), Icon: Trash2, color: 'rose' }
                                ].map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setClassification(opt.id as Classification)}
                                        className={clsx(
                                            "flex flex-col items-center justify-center py-3 rounded-sm border transition-all",
                                            classification === opt.id
                                                ? (isDarkMode
                                                    ? "bg-zinc-100 text-black border-zinc-100"
                                                    : "bg-zinc-900 text-white border-zinc-900")
                                                : (isDarkMode
                                                    ? "bg-transparent border-zinc-900 text-zinc-700 hover:border-zinc-700 hover:text-zinc-500"
                                                    : "bg-transparent border-zinc-200 text-zinc-400 hover:border-zinc-400 hover:text-zinc-700")
                                        )}
                                    >
                                        <span className="mb-2"><opt.Icon size={14} strokeWidth={2} /></span>
                                        <span className="text-[7px] font-black uppercase tracking-tight">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowDatePicker(!showDatePicker)}
                                className={clsx(
                                    "w-12 h-12 rounded-sm transition-all flex items-center justify-center border flex-shrink-0",
                                    showDatePicker
                                        ? (isDarkMode
                                            ? "bg-zinc-100 text-black border-zinc-100"
                                            : "bg-zinc-900 text-white border-zinc-900")
                                        : (isDarkMode
                                            ? "bg-transparent border-zinc-900 text-zinc-700 hover:border-zinc-700 hover:text-zinc-500"
                                            : "bg-transparent border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-700")
                                )}
                            >
                                <Clock size={16} strokeWidth={2} />
                            </button>
                            {showDatePicker ? (
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    max={new Date().toISOString().split('T')[0]}
                                    className={clsx(
                                        "flex-1 h-12 px-3 rounded-sm border text-xs focus:outline-none transition-colors",
                                        isDarkMode
                                            ? "border-zinc-900 bg-black text-zinc-300 focus:border-zinc-700"
                                            : "border-zinc-200 bg-white text-zinc-700 focus:border-zinc-400"
                                    )}
                                    style={{ colorScheme: isDarkMode ? 'dark' : 'light' }}
                                />
                            ) : (
                                <button
                                    onClick={handleSave}
                                    disabled={!isValid || saving}
                                    className={clsx(
                                        "flex-1 h-12 rounded-sm text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2",
                                        isValid && !saving
                                            ? (isDarkMode
                                                ? "bg-zinc-100 text-black hover:bg-white active:scale-[0.99]"
                                                : "bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.99]")
                                            : (isDarkMode
                                                ? "bg-transparent border border-zinc-900 text-zinc-800 cursor-not-allowed"
                                                : "bg-transparent border border-zinc-200 text-zinc-400 cursor-not-allowed")
                                    )}
                                >
                                    <Check size={14} strokeWidth={4} />
                                    {saving ? t('common.saving') : t('common.save')}
                                </button>
                            )}
                        </div>

                        {/* Confirm button when date picker is shown */}
                        {showDatePicker && (
                            <button
                                onClick={handleSave}
                                disabled={!isValid || saving}
                                className={clsx(
                                    "w-full h-12 rounded-sm text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2",
                                    isValid && !saving
                                        ? (isDarkMode
                                            ? "bg-zinc-100 text-black hover:bg-white active:scale-[0.99]"
                                            : "bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.99]")
                                        : (isDarkMode
                                            ? "bg-transparent border border-zinc-900 text-zinc-800 cursor-not-allowed"
                                            : "bg-transparent border border-zinc-200 text-zinc-400 cursor-not-allowed")
                                )}
                            >
                                <Check size={14} strokeWidth={4} />
                                {saving ? t('common.saving') : t('common.save')}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

