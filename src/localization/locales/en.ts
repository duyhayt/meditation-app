const en = {
  common: {
    continue: 'Continue',
    open: 'Open',
    retry: 'Retry',
    language: 'Language',
    theme: 'Theme',
    themeSystem: 'Follow system',
    themeLight: 'Light',
    themeDark: 'Dark',
    reduceMotion: 'Reduce motion',
    placeholderTitle: 'Planned for next phase',
    placeholderDescription: 'The structure is ready, and this route will be wired in a later phase.'
  },
  splash: {
    title: 'Meditation App',
    subtitle: 'A calm, offline-first companion for meditation, sleep, and mindful routines.'
  },
  onboarding: {
    eyebrow: 'Welcome',
    title: 'A lighter ritual for busy days and quiet nights',
    subtitle:
      'Start with simple guided sessions, breathing resets, sleep sounds, and a structure built for reliable offline playback.',
    primaryCta: 'Enter the app',
    bullets: {
      one: 'Offline-first structure with local database at the center',
      two: 'Clear audio architecture for bundled, streamed, and downloaded sessions',
      three: 'Calm premium-style UI with full dark and light themes'
    }
  },
  navigation: {
    homeTab: 'Home',
    meditateTab: 'Meditate',
    sleepTab: 'Sleep',
    profileTab: 'Profile'
  },
  home: {
    title: 'Good evening',
    subtitle: 'Choose a gentle place to begin.',
    quickStart: 'Start 5-minute meditation',
    continueSession: 'Continue last session',
    categories: 'Meditation paths',
    breathing: 'Breathing exercises',
    courses: 'Courses',
    sleep: 'Sleep sounds'
  },
  meditate: {
    categoryTitle: 'Meditation library',
    categorySubtitle: 'Browse guided sessions, breathing resets, and progressive courses.',
    listTitle: 'Meditations',
    listSubtitle: 'Pick a session that matches your current energy.',
    detailTitle: 'Meditation detail',
    detailSubtitle: 'Preview the structure, save for later, or begin playback.',
    playerTitle: 'Player',
    playerSubtitle: 'Phase 1 scaffolds the full-screen listening experience and flow.'
  },
  breathing: {
    title: 'Breathing exercises',
    subtitle: 'Simple patterns for focus, calm, and reset.',
    sessionTitle: 'Breathing session',
    sessionSubtitle: 'A guided timer surface will be connected in the next phase.'
  },
  sleep: {
    title: 'Sleep sounds',
    subtitle: 'Ambient soundscapes for bedtime or deep focus.'
  },
  courses: {
    title: 'Meditation courses',
    subtitle: 'Multi-lesson journeys designed for habit building.',
    detailTitle: 'Course detail',
    detailSubtitle: 'Review lessons, pace, and course outcomes.',
    lessonTitle: 'Lesson player',
    lessonSubtitle: 'Course lesson playback will plug into the shared AudioService.'
  },
  favorites: {
    title: 'Favorites',
    subtitle: 'Your saved meditations, sounds, and lessons.'
  },
  progress: {
    title: 'Progress',
    subtitle: 'Daily streaks, total mindful minutes, and completion trends.'
  },
  history: {
    title: 'History',
    subtitle: 'A local timeline of sessions and listening moments.'
  },
  reminders: {
    title: 'Reminder center',
    subtitle: 'Schedule daily mindfulness locally and prepare for notification integration.'
  },
  settings: {
    title: 'Settings',
    subtitle: 'Personalize language, theme, and app preferences stored on-device.',
    premium: 'Premium',
    login: 'Login',
    sync: 'Sync',
    account: 'Account'
  },
  placeholders: {
    premiumTitle: 'Premium placeholder',
    loginTitle: 'Login placeholder',
    syncTitle: 'Sync placeholder',
    accountTitle: 'Account placeholder'
  }
} as const;

export default en;
