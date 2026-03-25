import { createContext, useContext, type PropsWithChildren } from 'react';

import { createAppServices } from '@/services/di/app-services';
import type { AppServices } from '@/services/di/types';

const defaultServices = createAppServices();
const ServicesContext = createContext<AppServices>(defaultServices);

type ServicesProviderProps = PropsWithChildren<{
  services: AppServices;
}>;

export function ServicesProvider({ children, services }: ServicesProviderProps): React.JSX.Element {
  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}

export function useServices(): AppServices {
  return useContext(ServicesContext);
}

export function useLanguageService() {
  return useServices().languageService;
}

export function useDateTimeService() {
  return useServices().dateTimeService;
}

export function useLoggerService() {
  return useServices().loggerService;
}

export function useDatabaseService() {
  return useServices().databaseService;
}

export function useLocalFileStorageService() {
  return useServices().localFileStorageService;
}

export function useAudioService() {
  return useServices().audioService;
}

export function useDownloadService() {
  return useServices().downloadService;
}

export function useNotificationSchedulerService() {
  return useServices().notificationSchedulerService;
}

export function useReminderService() {
  return useServices().reminderService;
}

export function useSettingsRepository() {
  return useServices().settingsRepository;
}

export function useContentRepository() {
  return useServices().contentRepository;
}

export function useFavoritesRepository() {
  return useServices().favoritesRepository;
}

export function useDownloadsRepository() {
  return useServices().downloadsRepository;
}

export function useSessionHistoryRepository() {
  return useServices().sessionHistoryRepository;
}

export function useDailyProgressRepository() {
  return useServices().dailyProgressRepository;
}

export function useRemindersRepository() {
  return useServices().remindersRepository;
}
