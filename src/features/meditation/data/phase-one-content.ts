export type MeditationCategory = {
  id: string;
  title: string;
  subtitle: string;
  durationLabel: string;
};

export type MeditationItem = {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  durationMinutes: number;
  teacher: string;
  level: 'Beginner' | 'Intermediate';
};

export type BreathingExercise = {
  id: string;
  title: string;
  pattern: string;
  durationLabel: string;
};

export type SleepSound = {
  id: string;
  title: string;
  description: string;
  durationLabel: string;
};

export type MeditationCourse = {
  id: string;
  title: string;
  description: string;
  lessonCount: number;
  totalMinutes: number;
};

export type CourseLesson = {
  id: string;
  courseId: string;
  title: string;
  durationMinutes: number;
};

export const meditationCategories: MeditationCategory[] = [
  {
    id: 'stress-reset',
    title: 'Stress Reset',
    subtitle: 'Ground yourself and soften mental noise.',
    durationLabel: '6-12 min'
  },
  {
    id: 'deep-focus',
    title: 'Deep Focus',
    subtitle: 'Create a calm, attentive state before work.',
    durationLabel: '5-15 min'
  },
  {
    id: 'night-unwind',
    title: 'Night Unwind',
    subtitle: 'Slow down gently and prepare for rest.',
    durationLabel: '8-20 min'
  }
];

export const meditations: MeditationItem[] = [
  {
    id: 'five-minute-arrival',
    categoryId: 'stress-reset',
    title: 'Five-Minute Arrival',
    description: 'A short reset for anxious moments or busy afternoons.',
    durationMinutes: 5,
    teacher: 'Lina',
    level: 'Beginner'
  },
  {
    id: 'soften-the-thoughts',
    categoryId: 'stress-reset',
    title: 'Soften the Thoughts',
    description: 'Observe thoughts without following every story.',
    durationMinutes: 12,
    teacher: 'Evan',
    level: 'Intermediate'
  },
  {
    id: 'clarity-before-work',
    categoryId: 'deep-focus',
    title: 'Clarity Before Work',
    description: 'Breathe, settle, and start the next block with intention.',
    durationMinutes: 9,
    teacher: 'Maya',
    level: 'Beginner'
  },
  {
    id: 'sleepy-body-scan',
    categoryId: 'night-unwind',
    title: 'Sleepy Body Scan',
    description: 'Progressively release tension from jaw to toes.',
    durationMinutes: 14,
    teacher: 'Noah',
    level: 'Beginner'
  }
];

export const breathingExercises: BreathingExercise[] = [
  {
    id: 'box-breathing',
    title: 'Box Breathing',
    pattern: '4 in • 4 hold • 4 out • 4 hold',
    durationLabel: '5 minutes'
  },
  {
    id: 'deep-calm',
    title: 'Deep Calm',
    pattern: '4 in • 6 out',
    durationLabel: '8 minutes'
  },
  {
    id: 'morning-boost',
    title: 'Morning Boost',
    pattern: '3 in • 3 out',
    durationLabel: '4 minutes'
  }
];

export const sleepSounds: SleepSound[] = [
  {
    id: 'ocean-dusk',
    title: 'Ocean Dusk',
    description: 'A wide shoreline wash with soft depth.',
    durationLabel: 'Loop'
  },
  {
    id: 'rain-on-glass',
    title: 'Rain on Glass',
    description: 'Warm rain with a stable, cozy texture.',
    durationLabel: '45 min'
  },
  {
    id: 'forest-night',
    title: 'Forest Night',
    description: 'Low wind, distant birds, and natural spaciousness.',
    durationLabel: '60 min'
  }
];

export const meditationCourses: MeditationCourse[] = [
  {
    id: 'basics-of-stillness',
    title: 'Basics of Stillness',
    description: 'A gentle first-week course for building a steady habit.',
    lessonCount: 7,
    totalMinutes: 64
  },
  {
    id: 'focus-in-motion',
    title: 'Focus in Motion',
    description: 'A practical series for transitions between tasks and meetings.',
    lessonCount: 5,
    totalMinutes: 42
  }
];

export const courseLessons: CourseLesson[] = [
  { id: 'lesson-1', courseId: 'basics-of-stillness', title: 'Arrive in the Body', durationMinutes: 8 },
  { id: 'lesson-2', courseId: 'basics-of-stillness', title: 'Breath as an Anchor', durationMinutes: 9 },
  { id: 'lesson-3', courseId: 'focus-in-motion', title: 'Single Task Reset', durationMinutes: 7 }
];

export function getCategoryById(categoryId?: string): MeditationCategory | undefined {
  return meditationCategories.find((item) => item.id === categoryId);
}

export function getMeditationById(meditationId: string): MeditationItem | undefined {
  return meditations.find((item) => item.id === meditationId);
}

export function getMeditationsByCategory(categoryId?: string): MeditationItem[] {
  if (!categoryId) {
    return meditations;
  }

  return meditations.filter((item) => item.categoryId === categoryId);
}

export function getCourseById(courseId: string): MeditationCourse | undefined {
  return meditationCourses.find((item) => item.id === courseId);
}

export function getCourseLessons(courseId: string): CourseLesson[] {
  return courseLessons.filter((item) => item.courseId === courseId);
}
