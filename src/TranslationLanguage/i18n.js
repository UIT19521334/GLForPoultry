import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './en.json';
import translationVN from './vn.json';

const resources = {
    en: {
        translation: translationEN,
    },
    vn: {
        translation: translationVN,
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: localStorage.getItem('language') ? localStorage.getItem('language') : 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});
