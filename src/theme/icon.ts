export const iconSize = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28
} as const;

export const appIconMap = {
  home: 'view-dashboard-outline',
  debts: 'notebook-outline',
  statistics: 'chart-donut',
  settings: 'cog-outline',
  addDebt: 'plus-circle',
  addContact: 'account-plus-outline',
  reminder: 'bell-ring-outline',
  overdue: 'clock-alert-outline',
  payment: 'cash-fast',
  edit: 'pencil-outline',
  delete: 'trash-can-outline',
  search: 'magnify',
  backup: 'cloud-upload-outline',
  restore: 'cloud-download-outline',
  notification: 'bell-outline',
  premium: 'crown-outline',
  sync: 'sync',
  account: 'account-circle-outline',
  contact: 'account-outline',
  chevronLeft: 'chevron-left',
  chevronRight: 'chevron-right',
  chevronDown: 'chevron-down',
  debtLend: 'arrow-top-right-thin-circle-outline',
  debtBorrow: 'arrow-bottom-left-thin-circle-outline',
  calendar: 'calendar-month-outline',
  note: 'note-text-outline',
  phone: 'phone-outline',
  email: 'email-outline',
  empty: 'inbox-outline',
  error: 'alert-circle-outline',
  success: 'check-circle-outline'
} as const;

export type AppIconName = keyof typeof appIconMap;
