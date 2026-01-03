import { useEffect, useState } from 'react';
import axios from 'axios';
import { QuickAdd } from './components/QuickAdd';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { RefreshCw, History, ArrowUp, ArrowDown, TrendingUp, Wallet, Landmark, Home, ShoppingCart, Train, Cloud, Activity, Pill, PartyPopper, Package, Heart, Settings, Repeat, Gift, BarChart3, Filter, X } from 'lucide-react';
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

    const fetchData = async () => {
        setLoading(true);
        try {
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

    if (loading && categories.length === 0) return <div className="min-h-screen bg-black text-zinc-500 flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em]">Loading</div>;

    return (
        <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-zinc-800 pb-12">
            <div className="max-w-md mx-auto px-6 pt-8">

                {activeType && !selectedCategory && (
                    <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setActiveType(null)} />
                )}

                <header className="flex justify-between items-center mb-10">
                    <h1 className="text-sm font-black tracking-[0.3em] uppercase text-zinc-400">Kakei</h1>
                    <button onClick={fetchData} className="p-2 text-zinc-600 hover:text-white transition-colors">
                        <RefreshCw size={14} />
                    </button>
                </header>

                <section className="mb-12">
                    <div className="border border-zinc-900 bg-[#050505] p-6 rounded-md shadow-sm">
                        <div className="mb-6">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 block mb-1">Status</span>
                            <div className={clsx("text-4xl font-bold tracking-tighter tabular-nums", {
                                "text-emerald-500": dashboard.balance > 0,
                                "text-rose-600": dashboard.balance < 0,
                                "text-zinc-100": dashboard.balance === 0
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
                                        stroke="#27272a"
                                        strokeWidth={1}
                                        fill="#09090b"
                                        isAnimationActive={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-900">
                            {[
                                { label: 'Income', value: dashboard.income, sym: '+' },
                                { label: 'Expenses', value: dashboard.expenses, sym: '-' },
                                { label: 'Investment', value: dashboard.investments, sym: '•' }
                            ].map((met) => (
                                <div key={met.label}>
                                    <span className="text-[8px] font-black uppercase tracking-tight text-zinc-600 block mb-1">{met.label}</span>
                                    <div className="text-[11px] font-bold text-zinc-300 tabular-nums">{met.sym}{met.value.toFixed(0)}€</div>
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
                                        ? `bg-zinc-100 text-black border-zinc-100`
                                        : "bg-black border-zinc-900 text-zinc-600 hover:border-zinc-700 hover:text-zinc-300"
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
                        <h2 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] flex items-center gap-2">
                            <History size={10} /> Transactions
                        </h2>
                        <button 
                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                            className="p-1.5 text-zinc-600 hover:text-zinc-300 transition-colors relative"
                        >
                            <Filter size={12} />
                        </button>
                    </div>

                    {/* Filter Dropdown */}
                    {showFilterDropdown && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => { setShowFilterDropdown(false); setShowDatePicker(false); }} />
                            <div className="absolute right-0 top-8 z-50 bg-[#050505] border border-zinc-900 rounded-md shadow-2xl p-3 w-64 animate-in slide-in-from-top-1 duration-150">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[8px] font-black uppercase tracking-wide text-zinc-600">Filter by</span>
                                    <button onClick={() => { setShowFilterDropdown(false); setShowDatePicker(false); }} className="text-zinc-700 hover:text-zinc-400">
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
                                                    ? "bg-zinc-800 text-zinc-100" 
                                                    : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
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
                                                    ? "bg-zinc-800 text-zinc-100" 
                                                    : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
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
                                                    ? "bg-zinc-800 text-zinc-100" 
                                                    : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
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
                                                    ? "bg-zinc-800 text-zinc-100" 
                                                    : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                                            )}
                                        >
                                            This Year
                                        </button>

                                        <button
                                            onClick={() => setShowDatePicker(true)}
                                            className={clsx(
                                                "w-full text-left px-3 py-2 rounded-sm text-[10px] font-bold uppercase tracking-wide transition-colors",
                                                filterType === 'range' 
                                                    ? "bg-zinc-800 text-zinc-100" 
                                                    : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                                            )}
                                        >
                                            Specific Time
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[8px] font-black uppercase tracking-wide text-zinc-600 block mb-1.5">From</label>
                                            <input 
                                                type="date" 
                                                value={filterStartDate}
                                                onChange={(e) => setFilterStartDate(e.target.value)}
                                                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 text-[10px] px-2 py-1.5 rounded focus:outline-none focus:border-zinc-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[8px] font-black uppercase tracking-wide text-zinc-600 block mb-1.5">To</label>
                                            <input 
                                                type="date" 
                                                value={filterEndDate}
                                                onChange={(e) => setFilterEndDate(e.target.value)}
                                                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 text-[10px] px-2 py-1.5 rounded focus:outline-none focus:border-zinc-600"
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
                                                className="flex-1 bg-zinc-800 disabled:bg-zinc-950 disabled:text-zinc-700 text-zinc-200 text-[9px] font-bold uppercase tracking-wide px-3 py-2 rounded hover:bg-zinc-700 transition-colors"
                                            >
                                                Apply
                                            </button>
                                            <button
                                                onClick={() => setShowDatePicker(false)}
                                                className="flex-1 bg-zinc-950 text-zinc-500 text-[9px] font-bold uppercase tracking-wide px-3 py-2 rounded hover:bg-zinc-900 transition-colors"
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
                            <div key={tx.id} className="group flex items-center justify-between py-3 border-b border-zinc-900/50 last:border-0">
                                <div className="flex items-center gap-4">
                                    <div className="text-zinc-700 group-hover:text-zinc-400 transition-colors">
                                        <DynamicIcon name={tx.icon} size={16} />
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-bold text-zinc-300 leading-none mb-1">{tx.category}</div>
                                        <div className="text-[8px] font-black text-zinc-700 uppercase tracking-tight">
                                            {new Date(tx.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                                            {tx.note && <span className="opacity-50"> / {tx.note}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className={clsx("text-xs font-bold tabular-nums", {
                                    "text-rose-900": tx.type === 'expense',
                                    "text-emerald-500": tx.type === 'income',
                                    "text-zinc-400": tx.type === 'investment'
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
