import { useState, useRef, useEffect } from 'react';
import { X, Check, ArrowLeft, Wallet, Gift, Repeat, TrendingUp, BarChart3, Landmark, Home, ShoppingCart, Train, Cloud, Activity, Pill, PartyPopper, Package, Heart, Settings, Zap, Star, Trash2, Sparkles } from 'lucide-react';
import clsx from 'clsx';

interface Category {
    id: number;
    name: string;
    icon: string;
    type: 'income' | 'expense' | 'investment';
}

interface QuickAddProps {
    type: 'expense' | 'income' | 'investment';
    categories: Category[];
    onAddTransaction: (categoryId: number, amount: number, note: string, classification: string | null) => Promise<void>;
    onClose: () => void;
    isDropdown?: boolean;
    onSelectCategory?: (cat: Category) => void;
    selectedCategory?: Category | null;
}

const IconMap: { [key: string]: any } = {
    Wallet, Gift, Repeat, TrendingUp, BarChart3, Landmark,
    Home, ShoppingCart, Train, Cloud, Activity, Pill, PartyPopper, Package, Heart, Settings
};

function DynamicIcon({ name, size = 18, className = "" }: { name: string, size?: number, className?: string }) {
    const Icon = IconMap[name] || Settings;
    return <Icon size={size} className={className} />;
}

export function QuickAdd({
    type,
    categories,
    onAddTransaction,
    onClose,
    isDropdown = false,
    onSelectCategory,
    selectedCategory: externalSelectedCategory
}: QuickAddProps) {
    const [internalSelectedCategory, setInternalSelectedCategory] = useState<Category | null>(null);
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [classification, setClassification] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectedCategory = externalSelectedCategory || internalSelectedCategory;
    const isVital = selectedCategory && ['Housing', 'Groceries', 'Transport'].includes(selectedCategory.name);

    useEffect(() => {
        if (selectedCategory && inputRef.current) {
            inputRef.current.focus();
        }
        if (isVital) setClassification('survival');
        else setClassification(null);
    }, [selectedCategory, isVital]);

    const handleCategoryClick = (category: Category) => {
        if (onSelectCategory) onSelectCategory(category);
        else setInternalSelectedCategory(category);
    };

    const handleSubmit = async (finalClassification: string | null) => {
        if (!selectedCategory || !amount || !note.trim()) return;
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount)) return;

        await onAddTransaction(selectedCategory.id, numAmount, note, finalClassification);

        setAmount('');
        setNote('');
        setClassification(null);
        setInternalSelectedCategory(null);
    };

    const isExpense = type === 'expense';
    const isValid = amount.length > 0 && note.trim().length > 0 && (!isExpense || classification !== null);

    // DROPDOWN MODE (Category Selection)
    if (isDropdown && !selectedCategory) {
        return (
            <div className={clsx(
                "absolute top-full mt-1 z-50 animate-in slide-in-from-top-1 duration-150 w-[200px]",
                type === 'expense' ? "left-0" :
                    type === 'investment' ? "right-0" : "left-1/2 -translate-x-1/2"
            )}>
                <div className="bg-[#050505] border border-zinc-900 rounded-md shadow-2xl p-1 flex flex-col gap-px max-h-[300px] overflow-y-auto">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat)}
                            className="flex items-center gap-3 p-3 rounded-sm transition-colors active:bg-zinc-800 group w-full text-left hover:bg-zinc-900"
                        >
                            <span className="text-zinc-600 group-hover:text-zinc-300">
                                <DynamicIcon name={cat.icon} size={14} />
                            </span>
                            <span className="text-[10px] font-black text-zinc-500 group-hover:text-zinc-300 uppercase tracking-widest">{cat.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // AMOUNT ENTRY MODAL
    if (selectedCategory) {
        return (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 z-[100] animate-in fade-in duration-200">
                <div className="bg-black border border-zinc-900 rounded-md p-8 w-full max-w-sm shadow-2xl relative">

                    <div className="flex justify-between absolute top-4 left-4 right-4 font-sans">
                        <button
                            onClick={() => {
                                if (onSelectCategory) onSelectCategory(null as any);
                                else setInternalSelectedCategory(null);
                            }}
                            className="p-2 text-zinc-700 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={16} />
                        </button>
                        <button onClick={onClose} className="p-2 text-zinc-700 hover:text-white transition-colors">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="flex flex-col items-center mb-10 mt-4">
                        <div className="text-zinc-400 mb-3">
                            <DynamicIcon name={selectedCategory.icon} size={32} />
                        </div>
                        <h3 className="text-[10px] font-black text-zinc-500 tracking-[0.3em] uppercase">{selectedCategory.name}</h3>
                    </div>

                    <div className="space-y-8">
                        <div className="relative">
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-xl font-light text-zinc-800">€</span>
                            <input
                                ref={inputRef}
                                type="number"
                                inputMode="decimal"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-transparent text-5xl font-bold text-center py-4 border-b border-zinc-900 focus:border-zinc-500 focus:ring-0 outline-none transition-all placeholder:text-zinc-900 text-white tabular-nums"
                                step="0.01"
                            />
                        </div>

                        <input
                            type="text"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Note"
                            className="w-full bg-transparent border-b border-zinc-900 text-center text-xs font-medium text-zinc-500 py-2 focus:border-zinc-500 focus:ring-0 focus:outline-none transition-colors placeholder:text-zinc-900"
                        />

                        <div className="space-y-6">
                            {isExpense && (
                                <div className="grid grid-cols-4 gap-1">
                                    {[
                                        { id: 'survival', label: 'Vital', Icon: Zap, color: 'emerald' },
                                        { id: 'quality', label: 'Useful', Icon: Star, color: 'blue' },
                                        { id: 'pleasure', label: 'Treat', Icon: Sparkles, color: 'amber' },
                                        { id: 'waste', label: 'Waste', Icon: Trash2, color: 'rose' }
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setClassification(opt.id)}
                                            className={clsx(
                                                "flex flex-col items-center justify-center py-3 rounded-sm border transition-all",
                                                classification === opt.id
                                                    ? `bg-zinc-100 text-black border-zinc-100`
                                                    : "bg-transparent border-zinc-900 text-zinc-700 hover:border-zinc-700 hover:text-zinc-500"
                                            )}
                                        >
                                            <span className="mb-2"><opt.Icon size={14} strokeWidth={2} /></span>
                                            <span className="text-[7px] font-black uppercase tracking-tight">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={() => handleSubmit(classification)}
                                disabled={!isValid}
                                className={clsx(
                                    "w-full h-12 rounded-sm text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2",
                                    isValid
                                        ? "bg-zinc-100 text-black hover:bg-white active:scale-[0.99]"
                                        : "bg-transparent border border-zinc-900 text-zinc-800 cursor-not-allowed"
                                )}
                            >
                                <Check size={14} strokeWidth={4} />
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
