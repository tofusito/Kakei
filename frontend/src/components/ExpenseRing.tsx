import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

interface ExpenseRingProps {
    survival: number;
    quality: number;
    pleasure: number;
    waste: number;
    onClick: () => void;
    isDarkMode: boolean;
}

export function ExpenseRing({ survival, quality, pleasure, waste, onClick, isDarkMode }: ExpenseRingProps) {
    const total = survival + quality + pleasure + waste;
    
    if (total === 0) {
        return (
            <button
                onClick={onClick}
                className={clsx(
                    "w-10 h-10 rounded-full border-2 border-dashed flex items-center justify-center transition-all hover:scale-110 active:scale-95",
                    isDarkMode ? "border-zinc-800 text-zinc-700 hover:border-zinc-600" : "border-zinc-300 text-zinc-400 hover:border-zinc-400"
                )}
            >
                <ChevronDown size={14} />
            </button>
        );
    }

    // Calculate percentages
    const survivalPct = (survival / total) * 100;
    const qualityPct = (quality / total) * 100;
    const pleasurePct = (pleasure / total) * 100;
    
    // Create conic gradient based on percentages
    const gradient = `conic-gradient(
        from 0deg,
        #10b981 0% ${survivalPct}%,
        #3b82f6 ${survivalPct}% ${survivalPct + qualityPct}%,
        #f59e0b ${survivalPct + qualityPct}% ${survivalPct + qualityPct + pleasurePct}%,
        #ef4444 ${survivalPct + qualityPct + pleasurePct}% 100%
    )`;

    return (
        <button
            onClick={onClick}
            className="relative w-10 h-10 rounded-full transition-all hover:scale-110 active:scale-95 group"
            style={{
                background: gradient
            }}
        >
            <div className={clsx(
                "absolute inset-[6px] rounded-full flex items-center justify-center",
                isDarkMode ? "bg-[#050505]" : "bg-white"
            )}>
                <ChevronDown 
                    size={14} 
                    className={clsx(
                        "transition-colors",
                        isDarkMode ? "text-zinc-600 group-hover:text-zinc-400" : "text-zinc-400 group-hover:text-zinc-600"
                    )}
                />
            </div>
        </button>
    );
}

