import { appImageTokens } from '@/assets/image-registry';

export type ContentTone = 'meditation' | 'sleep' | 'breathing' | 'course';

export type MeditationCategory = {
  id: string;
  title: string;
  subtitle: string;
  durationLabel: string;
  coverImageUri: string;
  ambientLabel: string;
  tone: ContentTone;
};

export type MeditationItem = {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  durationMinutes: number;
  teacher: string;
  level: 'Beginner' | 'Intermediate';
  coverImageUri: string;
  thumbnailUri: string;
  tone: ContentTone;
};

export type BreathingExercise = {
  id: string;
  title: string;
  pattern: string;
  durationLabel: string;
  coverImageUri: string;
  tone: ContentTone;
};

export type SleepSound = {
  id: string;
  title: string;
  description: string;
  durationLabel: string;
  durationSeconds?: number | null;
  coverImageUri: string;
  tone: ContentTone;
  audioType?: 'bundled' | 'stream';
  streamUrl?: string | null;
  bundledAssetName?: string | null;
};

export type MeditationCourse = {
  id: string;
  title: string;
  description: string;
  lessonCount: number;
  totalMinutes: number;
  coverImageUri: string;
  tone: ContentTone;
};

export type CourseLesson = {
  id: string;
  courseId: string;
  title: string;
  durationMinutes: number;
  coverImageUri: string;
  tone: ContentTone;
};

export const mediaLibrary = {
  sunriseMeditation: appImageTokens.sunriseMeditation,
  mountainLake: appImageTokens.mountainLake,
  forestMist: appImageTokens.forestMist,
  moonSky: appImageTokens.moonSky,
  oceanNight: appImageTokens.oceanNight,
  clouds: appImageTokens.clouds,
  breathing: appImageTokens.breathing,
  moonForest: appImageTokens.moonForest,
  course: appImageTokens.course,
  silhouette: appImageTokens.silhouette
} as const;

export const meditationCategories: MeditationCategory[] = [
  {
    id: 'stress-reset',
    title: 'Stress Reset',
    subtitle: 'Ground yourself and soften mental noise.',
    durationLabel: '6-12 min',
    coverImageUri: mediaLibrary.sunriseMeditation,
    ambientLabel: 'Gentle arrival',
    tone: 'meditation'
  },
  {
    id: 'deep-focus',
    title: 'Deep Focus',
    subtitle: 'Create a calm, attentive state before work.',
    durationLabel: '5-15 min',
    coverImageUri: mediaLibrary.mountainLake,
    ambientLabel: 'Clear attention',
    tone: 'meditation'
  },
  {
    id: 'night-unwind',
    title: 'Night Unwind',
    subtitle: 'Slow down gently and prepare for rest.',
    durationLabel: '8-20 min',
    coverImageUri: mediaLibrary.moonSky,
    ambientLabel: 'Quiet evenings',
    tone: 'sleep'
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
    level: 'Beginner',
    coverImageUri: mediaLibrary.sunriseMeditation,
    thumbnailUri: mediaLibrary.clouds,
    tone: 'meditation'
  },
  {
    id: 'soften-the-thoughts',
    categoryId: 'stress-reset',
    title: 'Soften the Thoughts',
    description: 'Observe thoughts without following every story.',
    durationMinutes: 12,
    teacher: 'Evan',
    level: 'Intermediate',
    coverImageUri: mediaLibrary.forestMist,
    thumbnailUri: mediaLibrary.silhouette,
    tone: 'meditation'
  },
  {
    id: 'clarity-before-work',
    categoryId: 'deep-focus',
    title: 'Clarity Before Work',
    description: 'Breathe, settle, and start the next block with intention.',
    durationMinutes: 9,
    teacher: 'Maya',
    level: 'Beginner',
    coverImageUri: mediaLibrary.mountainLake,
    thumbnailUri: mediaLibrary.clouds,
    tone: 'meditation'
  },
  {
    id: 'sleepy-body-scan',
    categoryId: 'night-unwind',
    title: 'Sleepy Body Scan',
    description: 'Progressively release tension from jaw to toes.',
    durationMinutes: 14,
    teacher: 'Noah',
    level: 'Beginner',
    coverImageUri: mediaLibrary.moonSky,
    thumbnailUri: mediaLibrary.moonForest,
    tone: 'sleep'
  }
];

export const breathingExercises: BreathingExercise[] = [
  {
    id: 'box-breathing',
    title: 'Box Breathing',
    pattern: '4 in • 4 hold • 4 out • 4 hold',
    durationLabel: '5 minutes',
    coverImageUri: mediaLibrary.breathing,
    tone: 'breathing'
  },
  {
    id: 'deep-calm',
    title: 'Deep Calm',
    pattern: '4 in • 6 out',
    durationLabel: '8 minutes',
    coverImageUri: mediaLibrary.clouds,
    tone: 'breathing'
  },
  {
    id: 'morning-boost',
    title: 'Morning Boost',
    pattern: '3 in • 3 out',
    durationLabel: '4 minutes',
    coverImageUri: mediaLibrary.forestMist,
    tone: 'breathing'
  }
];

export const sleepSounds: SleepSound[] = [
  {
    id: 'ocean-dusk',
    title: 'Sleep Piano',
    description: 'Soft piano phrases for a steadier, quieter bedtime rhythm.',
    durationLabel: '10 min',
    durationSeconds: 605,
    coverImageUri: mediaLibrary.oceanNight,
    tone: 'sleep',
    audioType: 'bundled',
    streamUrl: null,
    bundledAssetName: 'sleep/piano-music.mp3'
  },
  {
    id: 'rain-on-glass',
    title: 'Meditative Rain',
    description: 'Layered rainfall ambience with a soft meditative bed underneath.',
    durationLabel: '9 min',
    durationSeconds: 540,
    coverImageUri: mediaLibrary.moonForest,
    tone: 'sleep',
    audioType: 'bundled',
    streamUrl: null,
    bundledAssetName: 'sleep/meditative-rain.mp3'
  },
  {
    id: 'forest-night',
    title: 'Nature Walk',
    description: 'A calm outdoor soundscape for winding down without spoken guidance.',
    durationLabel: '5 min',
    durationSeconds: 324,
    coverImageUri: mediaLibrary.moonSky,
    tone: 'sleep',
    audioType: 'bundled',
    streamUrl: null,
    bundledAssetName: 'sleep/nature-walk.mp3'
  }
];

export const meditationCourses: MeditationCourse[] = [
  {
    id: 'basics-of-stillness',
    title: 'Basics of Stillness',
    description: 'A gentle first-week course for building a steady habit.',
    lessonCount: 7,
    totalMinutes: 64,
    coverImageUri: mediaLibrary.course,
    tone: 'course'
  },
  {
    id: 'focus-in-motion',
    title: 'Focus in Motion',
    description: 'A practical series for transitions between tasks and meetings.',
    lessonCount: 5,
    totalMinutes: 42,
    coverImageUri: mediaLibrary.silhouette,
    tone: 'course'
  }
];

export const courseLessons: CourseLesson[] = [
  {
    id: 'lesson-1',
    courseId: 'basics-of-stillness',
    title: 'Arrive in the Body',
    durationMinutes: 8,
    coverImageUri: mediaLibrary.sunriseMeditation,
    tone: 'course'
  },
  {
    id: 'lesson-2',
    courseId: 'basics-of-stillness',
    title: 'Breath as an Anchor',
    durationMinutes: 9,
    coverImageUri: mediaLibrary.clouds,
    tone: 'course'
  },
  {
    id: 'lesson-3',
    courseId: 'focus-in-motion',
    title: 'Single Task Reset',
    durationMinutes: 7,
    coverImageUri: mediaLibrary.mountainLake,
    tone: 'course'
  }
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
