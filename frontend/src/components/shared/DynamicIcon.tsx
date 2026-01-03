import {
    Wallet, Gift, Repeat, TrendingUp, BarChart3, Landmark,
    Home, ShoppingCart, Train, Cloud, Activity, Pill,
    PartyPopper, Package, Heart, Settings, Zap, Star, Trash2, Sparkles
} from 'lucide-react';

// Single source of truth for icon mapping
// Using 'any' type for IconMap due to LucideIcon's complex ForwardRef typing
export const IconMap: { [key: string]: any } = {
    Wallet, Gift, Repeat, TrendingUp, BarChart3, Landmark,
    Home, ShoppingCart, Train, Cloud, Activity, Pill,
    PartyPopper, Package, Heart, Settings, Zap, Star, Trash2, Sparkles
};

interface DynamicIconProps {
    name: string;
    size?: number;
    className?: string;
}

/**
 * Renders a Lucide icon dynamically based on icon name
 */
export function DynamicIcon({ name, size = 18, className = "" }: DynamicIconProps) {
    const Icon = IconMap[name] || Settings;
    return <Icon size={size} className={className} />;
}
