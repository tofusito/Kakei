import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Theme } from '../types';

export function useTheme() {
    const [theme, setTheme] = useState<Theme>('dark');
    const [showThemeMenu, setShowThemeMenu] = useState(false);

    const isDarkMode = theme === 'dark';

    // Toggle theme function exposed to components if needed, or simple setter
    const toggleTheme = (newTheme: Theme) => {
        setTheme(newTheme);
        // Persist to backend
        axios.post('/settings', { theme: newTheme }).catch(console.error);
    };

    // Initial fetch of settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get('/settings');
                if (res.data.theme) {
                    setTheme(res.data.theme);
                }
            } catch (e) {
                console.error("Failed to fetch settings", e);
            }
        };
        fetchSettings();
    }, []);

    return {
        theme,
        setTheme: toggleTheme,
        isDarkMode,
        showThemeMenu,
        setShowThemeMenu
    };
}
