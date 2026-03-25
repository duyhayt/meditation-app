import type { NavigatorScreenParams } from '@react-navigation/native';

export type PublicStackParamList = {
  Onboarding: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<AppTabsParamList>;
  DebtDetail: { debtId: string };
  AddDebt: { contactId?: string } | undefined;
  EditDebt: { debtId: string };
  AddPayment: { debtId: string };
  PaymentHistory: { debtId: string };
  ContactList: undefined;
  ContactDetail: { contactId: string };
  AddContact: { redirectTo?: 'AddDebt' | 'ContactList' } | undefined;
  EditContact: { contactId: string };
  ReminderCenter: { debtId?: string } | undefined;
  BackupRestore: undefined;
  Premium: undefined;
  Login: undefined;
  Sync: undefined;
  Account: undefined;
};

export type AppTabsParamList = {
  HomeTab: undefined;
  DebtsTab: undefined;
  StatisticsTab: undefined;
  SettingsTab: undefined;
};
