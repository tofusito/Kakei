import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Settings, Sun, Moon, Globe } from 'lucide-react';
import type { Theme } from '../types';

interface ThemeDropdownProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    setLanguage: (lang: string) => void;
    showThemeMenu: boolean;
    setShowThemeMenu: (show: boolean) => void;
    isDarkMode: boolean;
}

export function ThemeDropdown({
    theme,
    setTheme,
    setLanguage,
    showThemeMenu,
    setShowThemeMenu,
    isDarkMode
}: ThemeDropdownProps) {
    const { t, i18n } = useTranslation();

    return (
        <div className="relative">
            <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className={clsx(
                    "p-2 rounded-full transition-colors",
                    isDarkMode
                        ? "hover:bg-zinc-800 text-zinc-400"
                        : "hover:bg-zinc-100 text-zinc-400"
                )}
            >
                <Settings size={20} />
            </button>

            {showThemeMenu && (
                <div className={clsx(
                    "absolute right-0 top-full mt-2 w-48 rounded-lg shadow-xl border overflow-hidden py-1 z-50",
                    isDarkMode
                        ? "bg-zinc-900 border-zinc-800"
                        : "bg-white border-zinc-200"
                )}>
                    {/* Theme Section */}
                    <div className={clsx("px-4 py-2 text-[10px] font-bold uppercase tracking-wider border-b", isDarkMode ? "border-zinc-800 text-zinc-500" : "border-zinc-100 text-zinc-400")}>
                        {t('common.theme')}
                    </div>
                    {[
                        { id: 'light', label: t('common.light'), Icon: Sun },
                        { id: 'dark', label: t('common.dark'), Icon: Moon }
                    ].map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => {
                                setTheme(opt.id as Theme);
                            }}
                            className={clsx(
                                "w-full text-left px-4 py-3 text-xs font-medium transition-colors hover:bg-opacity-50 flex items-center gap-2",
                                theme === opt.id
                                    ? (isDarkMode ? "bg-zinc-800 text-white" : "bg-zinc-50 text-black")
                                    : (isDarkMode ? "text-zinc-400 hover:bg-zinc-800" : "text-zinc-600 hover:bg-zinc-50")
                            )}
                        >
                            <opt.Icon size={14} />
                            {opt.label}
                        </button>
                    ))}

                    {/* Language Section */}
                    <div className={clsx("px-4 py-2 text-[10px] font-bold uppercase tracking-wider border-b border-t", isDarkMode ? "border-zinc-800 text-zinc-500" : "border-zinc-100 text-zinc-400")}>
                        {t('common.language')}
                    </div>
                    {[
                        { id: 'en', label: t('common.english'), Icon: Globe },
                        { id: 'es', label: t('common.spanish'), Icon: Globe }
                    ].map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => {
                                setLanguage(opt.id);
                                // Optional: Close menu on language change or keep open
                            }}
                            className={clsx(
                                "w-full text-left px-4 py-3 text-xs font-medium transition-colors hover:bg-opacity-50 flex items-center gap-2",
                                i18n.language.startsWith(opt.id)
                                    ? (isDarkMode ? "bg-zinc-800 text-white" : "bg-zinc-50 text-black")
                                    : (isDarkMode ? "text-zinc-400 hover:bg-zinc-800" : "text-zinc-600 hover:bg-zinc-50")
                            )}
                        >
                            <span className="text-[10px] font-black uppercase tracking-wider w-4 text-center">{opt.id}</span>
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
