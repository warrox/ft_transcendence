import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/translation.json';
import fr from './locales/fr/translation.json';
import pt from './locales/pt/translation.json';

const savedLang = localStorage.getItem('language') || 'en';  // Récupère la langue enregistrée ou utilise 'en' par défaut

i18n
  .use(LanguageDetector)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      pt: { translation: pt },
    },
    lng: savedLang,  // Applique la langue au démarrage
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
