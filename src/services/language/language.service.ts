import { i18n, type AppLanguage } from '@/localization';
import type { LanguageService } from '@/services/di/types';
import { usePreferencesStore } from '@/state/preferences.store';

export function createLanguageService(): LanguageService {
  return {
    getCurrentLanguage: () => usePreferencesStore.getState().language,
    applyLanguage: async (language: AppLanguage) => {
      await i18n.changeLanguage(language);
    },
    setLanguage: async (language: AppLanguage) => {
      usePreferencesStore.getState().setLanguage(language);
      await i18n.changeLanguage(language);
    },
    toggleLanguage: async () => {
      const currentLanguage = usePreferencesStore.getState().language;
      const nextLanguage: AppLanguage = currentLanguage === 'en' ? 'vi' : 'en';
      usePreferencesStore.getState().setLanguage(nextLanguage);
      await i18n.changeLanguage(nextLanguage);
      return nextLanguage;
    }
  };
}
