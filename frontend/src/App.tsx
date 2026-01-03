import { useEffect, useState } from 'react';
import axios from 'axios';
import { QuickAdd } from './components/QuickAdd';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { RefreshCw, History, ArrowUp, ArrowDown, TrendingUp, Wallet, Landmark, Home, ShoppingCart, Train, Cloud, Activity, Pill, PartyPopper, Package, Heart, Settings, Repeat, Gift, BarChart3 } from 'lucide-react';
import clsx from 'clsx';

// Setup axios defaults
axios.defaults.baseURL = import.meta.env.PROD ? '/api' : '/api';

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

    const fetchData = async () => {
        setLoading(true);
        try {
            const catRes = await axios.get('/categories');
            setCategories(catRes.data);
            const [dashRes, histRes] = await Promise.all([
                axios.get('/dashboard'),
                axios.get('/history')
            ]);
            setDashboard(dashRes.data);
            setRecentTransactions(histRes.data);
        } catch (e) {
            console.error("Fetch error", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

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

                <section>
                    <h2 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                        <History size={10} /> Transactions
                    </h2>
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
