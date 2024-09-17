import i18next from 'i18next';
import 'intl-pluralrules';
import { initReactI18next } from 'react-i18next';

import { de, en, es, fr, hi, pt } from './locales';

export const languageResources = {
  en: { translation: en },
  es: { translation: es },
  hi: { translation: hi },
  pt: { translation: pt },
  fr: { translation: fr },
  de: { translation: de },
};

i18next.use(initReactI18next).init({
  resources: languageResources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
