import * as Localization from 'expo-localization';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en';
import vi from './locales/vi';

export const defaultNS = 'translation';

export const resources = {
  en: { translation: en },
  vi: { translation: vi }
} as const;

const deviceLanguage = Localization.getLocales()[0]?.languageCode;
const fallbackLanguage = deviceLanguage === 'vi' ? 'vi' : 'en';

if (!i18next.isInitialized) {
  void i18next.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    resources,
    lng: fallbackLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });
} else {
  i18next.addResourceBundle('en', defaultNS, en, true, true);
  i18next.addResourceBundle('vi', defaultNS, vi, true, true);
}

export const i18n = i18next;
export type AppLanguage = keyof typeof resources;
