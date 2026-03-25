import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AppLanguage } from '@/localization';

export type ThemePreference = 'system' | 'light' | 'dark';

export type PreferencesState = {
  hasHydrated: boolean;
  language: AppLanguage;
  themePreference: ThemePreference;
  hasCompletedOnboarding: boolean;
  currencyCode: string;
  setLanguage: (language: AppLanguage) => void;
  setThemePreference: (themePreference: ThemePreference) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setCurrencyCode: (currencyCode: string) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      language: 'vi',
      themePreference: 'system',
      hasCompletedOnboarding: false,
      currencyCode: 'VND',
      setLanguage: (language) => set({ language }),
      setThemePreference: (themePreference) => set({ themePreference }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      resetOnboarding: () => set({ hasCompletedOnboarding: false }),
      setCurrencyCode: (currencyCode) => set({ currencyCode }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated })
    }),
    {
      name: 'preferences-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        language: state.language,
        themePreference: state.themePreference,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        currencyCode: state.currencyCode
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
