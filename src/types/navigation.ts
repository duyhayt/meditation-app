import type { NavigatorScreenParams } from '@react-navigation/native';

export type PublicStackParamList = {
  Onboarding: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<AppTabsParamList>;
  CategoryList: undefined;
  MeditationList: { categoryId?: string } | undefined;
  MeditationDetail: { meditationId: string };
  AudioPlayer: {
    contentId: string;
    contentType: 'meditation' | 'sleep_sound' | 'course_lesson';
  };
  BreathingList: undefined;
  BreathingSession: { exerciseId: string };
  CourseList: undefined;
  CourseDetail: { courseId: string };
  CourseLessonPlayer: { courseId: string; lessonId: string };
  Favorites: undefined;
  Progress: undefined;
  History: undefined;
  ReminderCenter: undefined;
  Settings: undefined;
  Premium: undefined;
  Login: undefined;
  Sync: undefined;
  Account: undefined;
};

export type AppTabsParamList = {
  HomeTab: undefined;
  MeditateTab: undefined;
  SleepTab: undefined;
  ProfileTab: undefined;
};
