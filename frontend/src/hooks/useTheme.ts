import { useState, useEffect } from 'react';
import axios from 'axios';
import i18n from '../i18n';
import type { Theme } from '../types';

// Get initial theme from localStorage for instant load (no flash)
const getInitialTheme = (): Theme => {
    try {
        const saved = localStorage.getItem('theme');
        return (saved === 'light' || saved === 'dark') ? saved : 'dark';
    } catch {
        return 'dark';
    }
};

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(getInitialTheme());
    const [showThemeMenu, setShowThemeMenu] = useState(false);

    const isDarkMode = theme === 'dark';

    // Update theme and persist to both localStorage and DB
    const updateTheme = (newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        axios.post('/settings', {
            theme: newTheme,
            language: i18n.language
        }).catch(console.error);
    };

    // Update language and persist
    const setLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
        axios.post('/settings', {
            theme,
            language: lang
        }).catch(console.error);
    };

    // Initial fetch of settings from DB (sync with server)
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get('/settings');
                if (res.data.theme) {
                    setTheme(res.data.theme);
                    localStorage.setItem('theme', res.data.theme);
                }
                if (res.data.language) {
                    i18n.changeLanguage(res.data.language);
                    localStorage.setItem('language', res.data.language);
                }
            } catch (e) {
                console.error("Failed to fetch settings", e);
            }
        };
        fetchSettings();
    }, []);

    return {
        theme,
        setTheme: updateTheme,
        setLanguage,
        isDarkMode,
        showThemeMenu,
        setShowThemeMenu
    };
}
