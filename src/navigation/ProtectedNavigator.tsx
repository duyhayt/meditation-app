import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AccountScreen } from '@/features/account/screens/AccountScreen';
import { AudioPlayerScreen } from '@/features/audio/screens/AudioPlayerScreen';
import { BreathingListScreen } from '@/features/breathing/screens/BreathingListScreen';
import { BreathingSessionScreen } from '@/features/breathing/screens/BreathingSessionScreen';
import { CourseDetailScreen } from '@/features/courses/screens/CourseDetailScreen';
import { CourseLessonPlayerScreen } from '@/features/courses/screens/CourseLessonPlayerScreen';
import { CourseListScreen } from '@/features/courses/screens/CourseListScreen';
import { FavoritesScreen } from '@/features/favorites/screens/FavoritesScreen';
import { HistoryScreen } from '@/features/history/screens/HistoryScreen';
import { CategoryListScreen } from '@/features/meditation/screens/CategoryListScreen';
import { MeditationDetailScreen } from '@/features/meditation/screens/MeditationDetailScreen';
import { MeditationListScreen } from '@/features/meditation/screens/MeditationListScreen';
import { PremiumScreen } from '@/features/premium/screens/PremiumScreen';
import { ProgressScreen } from '@/features/progress/screens/ProgressScreen';
import { ReminderCenterScreen } from '@/features/reminders/screens/ReminderCenterScreen';
import { LoginScreen } from '@/features/settings/screens/LoginScreen';
import { SettingsScreen } from '@/features/settings/screens/SettingsScreen';
import { SyncScreen } from '@/features/sync/screens/SyncScreen';
import type { RootStackParamList } from '@/types/navigation';

import { TabsWithFab } from './TabsNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function ProtectedNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="MainTabs" component={TabsWithFab} />
      <Stack.Screen name="CategoryList" component={CategoryListScreen} />
      <Stack.Screen name="MeditationList" component={MeditationListScreen} />
      <Stack.Screen name="MeditationDetail" component={MeditationDetailScreen} />
      <Stack.Screen name="AudioPlayer" component={AudioPlayerScreen} />
      <Stack.Screen name="BreathingList" component={BreathingListScreen} />
      <Stack.Screen name="BreathingSession" component={BreathingSessionScreen} />
      <Stack.Screen name="CourseList" component={CourseListScreen} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
      <Stack.Screen name="CourseLessonPlayer" component={CourseLessonPlayerScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="Progress" component={ProgressScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="ReminderCenter" component={ReminderCenterScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Premium" component={PremiumScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Sync" component={SyncScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
    </Stack.Navigator>
  );
}
