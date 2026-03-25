export const iconSize = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28
} as const;

export const appIconMap = {
  home: 'view-dashboard-outline',
  meditate: 'meditation',
  sleep: 'weather-night',
  profile: 'account-circle-outline',
  settings: 'cog-outline',
  play: 'play-circle-outline',
  pause: 'pause-circle-outline',
  favorite: 'heart-outline',
  favorites: 'heart-multiple-outline',
  reminder: 'bell-ring-outline',
  history: 'history',
  progress: 'chart-timeline-variant',
  edit: 'pencil-outline',
  delete: 'trash-can-outline',
  search: 'magnify',
  download: 'arrow-down-circle-outline',
  notification: 'bell-outline',
  premium: 'crown-outline',
  sync: 'sync',
  account: 'account-circle-outline',
  course: 'book-open-page-variant-outline',
  lesson: 'book-play-outline',
  category: 'shape-outline',
  breath: 'weather-windy',
  wave: 'waves',
  timer: 'timer-outline',
  chevronLeft: 'chevron-left',
  chevronRight: 'chevron-right',
  chevronDown: 'chevron-down',
  calendar: 'calendar-month-outline',
  note: 'note-text-outline',
  theme: 'theme-light-dark',
  language: 'translate',
  continue: 'play-circle',
  empty: 'inbox-outline',
  error: 'alert-circle-outline',
  success: 'check-circle-outline'
} as const;

export type AppIconName = keyof typeof appIconMap;
