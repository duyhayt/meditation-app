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
  reduceMotionEnabled: boolean;
  setLanguage: (language: AppLanguage) => void;
  setThemePreference: (themePreference: ThemePreference) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setReduceMotionEnabled: (enabled: boolean) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      language: 'vi',
      themePreference: 'system',
      hasCompletedOnboarding: false,
      reduceMotionEnabled: false,
      setLanguage: (language) => set({ language }),
      setThemePreference: (themePreference) => set({ themePreference }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      resetOnboarding: () => set({ hasCompletedOnboarding: false }),
      setReduceMotionEnabled: (reduceMotionEnabled) => set({ reduceMotionEnabled }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated })
    }),
    {
      name: 'preferences-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        language: state.language,
        themePreference: state.themePreference,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        reduceMotionEnabled: state.reduceMotionEnabled
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
