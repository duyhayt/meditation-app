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

export function useBackupRestoreService() {
  return useServices().backupRestoreService;
}

export function useContactsRepository() {
  return useServices().contactsRepository;
}

export function useDebtsRepository() {
  return useServices().debtsRepository;
}

export function usePaymentsRepository() {
  return useServices().paymentsRepository;
}

export function useRemindersRepository() {
  return useServices().remindersRepository;
}

export function useReminderSchedulerService() {
  return useServices().reminderSchedulerService;
}

export function useTagsRepository() {
  return useServices().tagsRepository;
}

export function useSettingsRepository() {
  return useServices().settingsRepository;
}

export function useStatisticsRepository() {
  return useServices().statisticsRepository;
}
