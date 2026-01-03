import { useEffect, useState } from 'react';
import axios from 'axios';
import { QuickAdd } from './components/QuickAdd';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { History, ArrowUp, ArrowDown, TrendingUp, Wallet, Landmark, Home, ShoppingCart, Train, Cloud, Activity, Pill, PartyPopper, Package, Heart, Settings, Repeat, Gift, BarChart3, Filter, X, Sun, Moon } from 'lucide-react';
import clsx from 'clsx';

// Setup axios defaults
axios.defaults.baseURL = '/api';

interface Transaction {
    id: number;
    amount: string;
    note: string | null;
    classification: 'survival' | 'quality' | 'pleasure' | 'waste' | null;
    createdAt: string;
    category: string;
    icon: string;
    type: 'income' | 'expense' | 'investment';
}

interface Category {
    id: number;
    name: string;
    icon: string;
    type: 'income' | 'expense' | 'investment';
}

interface ChartPoint {
    name: string;
    amount: number;
}

interface DashboardData {
    balance: number;
    expenses: number;
    income: number;
    investments: number;
    chartData: ChartPoint[];
}

const IconMap: { [key: string]: any } = {
    Wallet, Gift, Repeat, TrendingUp, BarChart3, Landmark,
    Home, ShoppingCart, Train, Cloud, Activity, Pill, PartyPopper, Package, Heart, Settings
};

function DynamicIcon({ name, size = 18, className = "" }: { name: string, size?: number, className?: string }) {
    const Icon = IconMap[name] || Settings;
    return <Icon size={size} className={className} />;
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
}

function App() {
    const [dashboard, setDashboard] = useState<DashboardData>({ balance: 0, expenses: 0, income: 0, investments: 0, chartData: [] });
    const [categories, setCategories] = useState<Category[]>([]);
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const [activeType, setActiveType] = useState<'expense' | 'income' | 'investment' | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    // Theme state
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

    // Filter state
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [filterType, setFilterType] = useState<'week' | 'month' | 'year' | 'range' | 'all'>('all');
    const [filterWeek, setFilterWeek] = useState(1);
    const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
    const [filterYear, setFilterYear] = useState(new Date().getFullYear());
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Helper to get current week number
    const getWeekNumber = (date: Date) => {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    };

    const toggleTheme = async (newTheme: 'light' | 'dark') => {
        try {
            await axios.post('/settings', { theme: newTheme });
            setIsDarkMode(newTheme === 'dark');
            setShowSettingsDropdown(false);
        } catch (e) {
            console.error('Error updating theme:', e);
        }
    };

    const fetchSettings = async () => {
        try {
            const res = await axios.get('/settings');
            setIsDarkMode(res.data.theme === 'dark');
        } catch (e) {
            console.error('Error fetching settings:', e);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch settings first time
            if (categories.length === 0) {
                await fetchSettings();
            }
            
            const catRes = await axios.get('/categories');
            setCategories(catRes.data);

            // Build filter params
            const params = new URLSearchParams();
            if (filterType !== 'all') {
                params.append('filterType', filterType);
                if (filterType === 'week') {
                    params.append('week', String(filterWeek));
                    params.append('year', String(filterYear));
                } else if (filterType === 'month') {
                    params.append('month', String(filterMonth));
                    params.append('year', String(filterYear));
                } else if (filterType === 'year') {
                    params.append('year', String(filterYear));
                } else if (filterType === 'range' && filterStartDate && filterEndDate) {
                    params.append('startDate', filterStartDate);
                    params.append('endDate', filterEndDate);
                }
            }

            const [dashRes, histRes] = await Promise.all([
                axios.get('/dashboard'),
                axios.get(`/history?${params.toString()}`)
            ]);
            setDashboard(dashRes.data);
            setRecentTransactions(histRes.data);
        } catch (e) {
            console.error("Fetch error", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
    
    useEffect(() => {
        if (filterType !== 'all') {
            fetchData();
        }
    }, [filterType, filterWeek, filterMonth, filterYear, filterStartDate, filterEndDate]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleAddTransaction = async (categoryId: number, amount: number, note: string, classification: string | null) => {
        try {
            setSelectedCategory(null);
            setActiveType(null);
            await axios.post('/transactions', { categoryId, amount, note, classification });
            await fetchData();
        } catch (e) {
            console.error(e);
            alert('Error saving');
        }
    };

    if (loading && categories.length === 0) return (
        <div className={clsx(
            "min-h-screen flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em]",
            isDarkMode ? "bg-black text-zinc-500" : "bg-white text-zinc-400"
        )}>
            Loading
        </div>
    );

    return (
        <div className={clsx(
            "min-h-screen font-sans pb-12 transition-colors duration-200",
            isDarkMode 
                ? "bg-black text-zinc-100 selection:bg-zinc-800" 
                : "bg-white text-zinc-900 selection:bg-zinc-200"
        )}>
            <div className="max-w-md mx-auto px-6 pt-8">

                {activeType && !selectedCategory && (
                    <div className={clsx(
                        "fixed inset-0 z-40 backdrop-blur-sm",
                        isDarkMode ? "bg-black/40" : "bg-white/40"
                    )} onClick={() => setActiveType(null)} />
                )}

                <header className="flex justify-between items-center mb-10 relative">
                    <h1 className={clsx(
                        "text-sm font-black tracking-[0.3em] uppercase",
                        isDarkMode ? "text-zinc-400" : "text-zinc-600"
                    )}>
                        Kakei
                    </h1>
                    <div className="relative">
                        <button 
                            onClick={() => setShowSettingsDropdown(!showSettingsDropdown)} 
                            className={clsx(
                                "p-2 transition-colors",
                                isDarkMode ? "text-zinc-600 hover:text-white" : "text-zinc-400 hover:text-zinc-900"
                            )}
                        >
                            <Settings size={14} />
                        </button>

                        {/* Settings Dropdown */}
                        {showSettingsDropdown && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowSettingsDropdown(false)} />
                                <div className={clsx(
                                    "absolute right-0 top-full mt-2 z-50 rounded-md shadow-2xl p-2 w-44 animate-in slide-in-from-top-1 duration-150",
                                    isDarkMode ? "bg-[#050505] border border-zinc-900" : "bg-white border border-zinc-200"
                                )}>
                                    {isDarkMode ? (
                                        <button
                                            onClick={() => toggleTheme('light')}
                                            className={clsx(
                                                "w-full text-left px-3 py-3 rounded-sm text-[10px] font-bold uppercase tracking-wide transition-all flex items-center gap-3",
                                                isDarkMode
                                                    ? "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                                                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                                            )}
                                        >
                                            <Sun size={16} className="animate-pulse" />
                                            <span>Modo Claro</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => toggleTheme('dark')}
                                            className={clsx(
                                                "w-full text-left px-3 py-3 rounded-sm text-[10px] font-bold uppercase tracking-wide transition-all flex items-center gap-3",
                                                isDarkMode
                                                    ? "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                                                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                                            )}
                                        >
                                            <Moon size={16} className="animate-pulse" />
                                            <span>Modo Oscuro</span>
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </header>

                <section className="mb-12">
                    <div className={clsx(
                        "border p-6 rounded-md shadow-sm",
                        isDarkMode 
                            ? "border-zinc-900 bg-[#050505]" 
                            : "border-zinc-200 bg-zinc-50"
                    )}>
                        <div className="mb-6">
                            <span className={clsx(
                                "text-[9px] font-black uppercase tracking-[0.2em] block mb-1",
                                isDarkMode ? "text-zinc-600" : "text-zinc-500"
                            )}>
                                Status
                            </span>
                            <div className={clsx("text-4xl font-bold tracking-tighter tabular-nums", {
                                "text-emerald-500": dashboard.balance > 0,
                                "text-rose-600": dashboard.balance < 0,
                                [isDarkMode ? "text-zinc-100" : "text-zinc-900"]: dashboard.balance === 0
                            })}>
                                {formatCurrency(dashboard.balance)}
                            </div>
                        </div>

                        <div className="h-20 w-full mb-6 grayscale opacity-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={dashboard.chartData}>
                                    <Area
                                        type="monotone"
                                        dataKey="amount"
                                        stroke={isDarkMode ? "#27272a" : "#d4d4d8"}
                                        strokeWidth={1}
                                        fill={isDarkMode ? "#09090b" : "#f4f4f5"}
                                        isAnimationActive={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className={clsx(
                            "grid grid-cols-3 gap-4 pt-6 border-t",
                            isDarkMode ? "border-zinc-900" : "border-zinc-200"
                        )}>
                            {[
                                { label: 'Income', value: dashboard.income, sym: '+' },
                                { label: 'Expenses', value: dashboard.expenses, sym: '-' },
                                { label: 'Investment', value: dashboard.investments, sym: '•' }
                            ].map((met) => (
                                <div key={met.label}>
                                    <span className={clsx(
                                        "text-[8px] font-black uppercase tracking-tight block mb-1",
                                        isDarkMode ? "text-zinc-600" : "text-zinc-500"
                                    )}>
                                        {met.label}
                                    </span>
                                    <div className={clsx(
                                        "text-[11px] font-bold tabular-nums",
                                        isDarkMode ? "text-zinc-300" : "text-zinc-700"
                                    )}>
                                        {met.sym}{met.value.toFixed(0)}€
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <nav className="grid grid-cols-3 gap-2 mb-12 sticky top-4 z-50">
                    {[
                        { id: 'expense', label: 'Expense', icon: ArrowDown, color: 'rose' },
                        { id: 'income', label: 'Income', icon: ArrowUp, color: 'emerald' },
                        { id: 'investment', label: 'Invest', icon: TrendingUp, color: 'blue' }
                    ].map((btn) => (
                        <div key={btn.id} className="relative">
                            <button
                                onClick={() => setActiveType(activeType === btn.id ? null : btn.id as any)}
                                className={clsx(
                                    "w-full flex flex-col items-center justify-center py-4 rounded-md border text-[9px] font-black uppercase tracking-widest transition-all",
                                    activeType === btn.id
                                        ? isDarkMode 
                                            ? "bg-zinc-100 text-black border-zinc-100"
                                            : "bg-zinc-900 text-white border-zinc-900"
                                        : isDarkMode
                                            ? "bg-black border-zinc-900 text-zinc-600 hover:border-zinc-700 hover:text-zinc-300"
                                            : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-900"
                                )}
                            >
                                <btn.icon size={16} className="mb-2" />
                                {btn.label}
                            </button>
                            {activeType === btn.id && (
                                <QuickAdd
                                    isDropdown
                                    type={btn.id as any}
                                    categories={categories.filter(c => c.type === btn.id)}
                                    onAddTransaction={handleAddTransaction}
                                    onClose={() => setActiveType(null)}
                                    onSelectCategory={setSelectedCategory}
                                />
                            )}
                        </div>
                    ))}
                </nav>

                <section className="relative">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className={clsx(
                            "text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2",
                            isDarkMode ? "text-zinc-600" : "text-zinc-500"
                        )}>
                            <History size={10} /> Transactions
                        </h2>
                        <button 
                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                            className={clsx(
                                "p-1.5 transition-colors relative",
                                isDarkMode ? "text-zinc-600 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-900"
                            )}
                        >
                            <Filter size={12} />
                        </button>
                    </div>

                    {/* Filter Dropdown */}
                    {showFilterDropdown && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => { setShowFilterDropdown(false); setShowDatePicker(false); }} />
                            <div className={clsx(
                                "absolute right-0 top-8 z-50 border rounded-md shadow-2xl p-3 w-64 animate-in slide-in-from-top-1 duration-150",
                                isDarkMode ? "bg-[#050505] border-zinc-900" : "bg-white border-zinc-200"
                            )}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className={clsx(
                                        "text-[8px] font-black uppercase tracking-wide",
                                        isDarkMode ? "text-zinc-600" : "text-zinc-500"
                                    )}>
                                        Filter by
                                    </span>
                                    <button 
                                        onClick={() => { setShowFilterDropdown(false); setShowDatePicker(false); }} 
                                        className={clsx(
                                            isDarkMode ? "text-zinc-700 hover:text-zinc-400" : "text-zinc-400 hover:text-zinc-900"
                                        )}
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                                
                                {!showDatePicker ? (
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => {
                                                setFilterType('all');
                                                setShowFilterDropdown(false);
                                                fetchData();
                                            }}
                                            className={clsx(
                                                "w-full text-left px-3 py-2 rounded-sm text-[10px] font-bold uppercase tracking-wide transition-colors",
                                                filterType === 'all' 
                                                    ? isDarkMode ? "bg-zinc-800 text-zinc-100" : "bg-zinc-100 text-zinc-900"
                                                    : isDarkMode ? "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                                            )}
                                        >
                                            All Time
                                        </button>
                                        
                                        <button
                                            onClick={() => {
                                                const now = new Date();
                                                setFilterType('week');
                                                setFilterWeek(getWeekNumber(now));
                                                setFilterYear(now.getFullYear());
                                                setShowFilterDropdown(false);
                                                fetchData();
                                            }}
                                            className={clsx(
                                                "w-full text-left px-3 py-2 rounded-sm text-[10px] font-bold uppercase tracking-wide transition-colors",
                                                filterType === 'week' 
                                                    ? isDarkMode ? "bg-zinc-800 text-zinc-100" : "bg-zinc-100 text-zinc-900"
                                                    : isDarkMode ? "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                                            )}
                                        >
                                            This Week
                                        </button>

                                        <button
                                            onClick={() => {
                                                setFilterType('month');
                                                setFilterMonth(new Date().getMonth() + 1);
                                                setFilterYear(new Date().getFullYear());
                                                setShowFilterDropdown(false);
                                                fetchData();
                                            }}
                                            className={clsx(
                                                "w-full text-left px-3 py-2 rounded-sm text-[10px] font-bold uppercase tracking-wide transition-colors",
                                                filterType === 'month' 
                                                    ? isDarkMode ? "bg-zinc-800 text-zinc-100" : "bg-zinc-100 text-zinc-900"
                                                    : isDarkMode ? "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                                            )}
                                        >
                                            This Month
                                        </button>

                                        <button
                                            onClick={() => {
                                                setFilterType('year');
                                                setFilterYear(new Date().getFullYear());
                                                setShowFilterDropdown(false);
                                                fetchData();
                                            }}
                                            className={clsx(
                                                "w-full text-left px-3 py-2 rounded-sm text-[10px] font-bold uppercase tracking-wide transition-colors",
                                                filterType === 'year' 
                                                    ? isDarkMode ? "bg-zinc-800 text-zinc-100" : "bg-zinc-100 text-zinc-900"
                                                    : isDarkMode ? "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                                            )}
                                        >
                                            This Year
                                        </button>

                                        <button
                                            onClick={() => setShowDatePicker(true)}
                                            className={clsx(
                                                "w-full text-left px-3 py-2 rounded-sm text-[10px] font-bold uppercase tracking-wide transition-colors",
                                                filterType === 'range' 
                                                    ? isDarkMode ? "bg-zinc-800 text-zinc-100" : "bg-zinc-100 text-zinc-900"
                                                    : isDarkMode ? "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                                            )}
                                        >
                                            Specific Time
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div>
                                            <label className={clsx(
                                                "text-[8px] font-black uppercase tracking-wide block mb-1.5",
                                                isDarkMode ? "text-zinc-600" : "text-zinc-500"
                                            )}>
                                                From
                                            </label>
                                            <input 
                                                type="date" 
                                                value={filterStartDate}
                                                onChange={(e) => setFilterStartDate(e.target.value)}
                                                className={clsx(
                                                    "w-full border text-[10px] px-2 py-1.5 rounded focus:outline-none",
                                                    isDarkMode 
                                                        ? "bg-zinc-950 border-zinc-800 text-zinc-300 focus:border-zinc-600"
                                                        : "bg-white border-zinc-300 text-zinc-900 focus:border-zinc-400"
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <label className={clsx(
                                                "text-[8px] font-black uppercase tracking-wide block mb-1.5",
                                                isDarkMode ? "text-zinc-600" : "text-zinc-500"
                                            )}>
                                                To
                                            </label>
                                            <input 
                                                type="date" 
                                                value={filterEndDate}
                                                onChange={(e) => setFilterEndDate(e.target.value)}
                                                className={clsx(
                                                    "w-full border text-[10px] px-2 py-1.5 rounded focus:outline-none",
                                                    isDarkMode 
                                                        ? "bg-zinc-950 border-zinc-800 text-zinc-300 focus:border-zinc-600"
                                                        : "bg-white border-zinc-300 text-zinc-900 focus:border-zinc-400"
                                                )}
                                            />
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <button
                                                onClick={() => {
                                                    if (filterStartDate && filterEndDate) {
                                                        setFilterType('range');
                                                        setShowFilterDropdown(false);
                                                        setShowDatePicker(false);
                                                        fetchData();
                                                    }
                                                }}
                                                disabled={!filterStartDate || !filterEndDate}
                                                className={clsx(
                                                    "flex-1 text-[9px] font-bold uppercase tracking-wide px-3 py-2 rounded transition-colors",
                                                    isDarkMode
                                                        ? "bg-zinc-800 disabled:bg-zinc-950 disabled:text-zinc-700 text-zinc-200 hover:bg-zinc-700"
                                                        : "bg-zinc-900 disabled:bg-zinc-100 disabled:text-zinc-400 text-white hover:bg-zinc-800"
                                                )}
                                            >
                                                Apply
                                            </button>
                                            <button
                                                onClick={() => setShowDatePicker(false)}
                                                className={clsx(
                                                    "flex-1 text-[9px] font-bold uppercase tracking-wide px-3 py-2 rounded transition-colors",
                                                    isDarkMode
                                                        ? "bg-zinc-950 text-zinc-500 hover:bg-zinc-900"
                                                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                                                )}
                                            >
                                                Back
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <div className="space-y-1">
                        {recentTransactions.slice(0, 12).map((tx) => (
                            <div key={tx.id} className={clsx(
                                "group flex items-center justify-between py-3 border-b last:border-0",
                                isDarkMode ? "border-zinc-900/50" : "border-zinc-200/50"
                            )}>
                                <div className="flex items-center gap-4">
                                    <div className={clsx(
                                        "transition-colors",
                                        isDarkMode ? "text-zinc-700 group-hover:text-zinc-400" : "text-zinc-400 group-hover:text-zinc-700"
                                    )}>
                                        <DynamicIcon name={tx.icon} size={16} />
                                    </div>
                                    <div>
                                        <div className={clsx(
                                            "text-[11px] font-bold leading-none mb-1",
                                            isDarkMode ? "text-zinc-300" : "text-zinc-700"
                                        )}>
                                            {tx.category}
                                        </div>
                                        <div className={clsx(
                                            "text-[8px] font-black uppercase tracking-tight",
                                            isDarkMode ? "text-zinc-700" : "text-zinc-500"
                                        )}>
                                            {new Date(tx.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                                            {tx.note && <span className="opacity-50"> / {tx.note}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className={clsx("text-xs font-bold tabular-nums", {
                                    "text-rose-600": tx.type === 'expense',
                                    "text-emerald-500": tx.type === 'income',
                                    [isDarkMode ? "text-zinc-400" : "text-zinc-600"]: tx.type === 'investment'
                                })}>
                                    {tx.type === 'income' ? '+' : '-'}{parseFloat(tx.amount).toFixed(0)}€
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {selectedCategory && (
                    <QuickAdd
                        type={selectedCategory.type}
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onAddTransaction={handleAddTransaction}
                        onClose={() => { setSelectedCategory(null); setActiveType(null); }}
                        onSelectCategory={setSelectedCategory}
                    />
                )}
            </div>
        </div>
    );
}

export default App;
