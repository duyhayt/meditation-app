import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState, type PropsWithChildren } from 'react';

import {
  ServicesProvider,
  useLanguageService,
  useSettingsRepository
} from '@/providers/ServicesProvider';
import { createAppServices } from '@/services/di/app-services';
import { usePreferencesStore } from '@/state/preferences.store';
import { ThemeProvider } from '@/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 2
    },
    mutations: {
      retry: 0
    }
  }
});

function LanguageSynchronizer(): null {
  const language = usePreferencesStore((state) => state.language);
  const languageService = useLanguageService();

  useEffect(() => {
    void languageService.applyLanguage(language);
  }, [language, languageService]);

  return null;
}

function PreferencesDatabaseSynchronizer(): null {
  const settingsRepository = useSettingsRepository();
  const language = usePreferencesStore((state) => state.language);
  const themePreference = usePreferencesStore((state) => state.themePreference);
  const currencyCode = usePreferencesStore((state) => state.currencyCode);
  const hasCompletedOnboarding = usePreferencesStore((state) => state.hasCompletedOnboarding);

  useEffect(() => {
    void settingsRepository.upsert('language', language, 'string');
  }, [language, settingsRepository]);

  useEffect(() => {
    void settingsRepository.upsert('theme_preference', themePreference, 'string');
  }, [settingsRepository, themePreference]);

  useEffect(() => {
    void settingsRepository.upsert('currency_code', currencyCode, 'string');
  }, [currencyCode, settingsRepository]);

  useEffect(() => {
    void settingsRepository.upsert(
      'has_completed_onboarding',
      String(hasCompletedOnboarding),
      'boolean'
    );
  }, [hasCompletedOnboarding, settingsRepository]);

  return null;
}

export function AppProviders({ children }: PropsWithChildren): React.JSX.Element {
  const [services] = useState(createAppServices);

  useEffect(() => {
    void services.databaseService
      .initialize()
      .then(() => services.reminderSchedulerService.reconcile())
      .catch((error) => {
        services.loggerService.error('Failed to initialize local database', error);
      });
  }, [services]);

  return (
    <ThemeProvider>
      <ServicesProvider services={services}>
        <QueryClientProvider client={queryClient}>
          <LanguageSynchronizer />
          <PreferencesDatabaseSynchronizer />
          {children}
        </QueryClientProvider>
      </ServicesProvider>
    </ThemeProvider>
  );
}
