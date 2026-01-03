import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enJSON from './locales/en.json';
import esJSON from './locales/es.json';

// Get initial language from localStorage for instant load
const getInitialLanguage = (): string => {
    try {
        const saved = localStorage.getItem('language');
        return (saved === 'en' || saved === 'es') ? saved : 'en';
    } catch {
        return 'en';
    }
};

i18n
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    .init({
        resources: {
            en: { translation: enJSON },
            es: { translation: esJSON }
        },
        fallbackLng: 'en',
        lng: getInitialLanguage(), // Load from localStorage for instant load
        debug: false,

        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        }
    });

export default i18n;
