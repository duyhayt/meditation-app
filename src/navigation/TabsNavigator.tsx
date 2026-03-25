import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

import { AppBottomTabBar } from '@/components/common/AppBottomTabBar';
import { HomeScreen } from '@/features/home/screens/HomeScreen';
import { CategoryListScreen } from '@/features/meditation/screens/CategoryListScreen';
import { ProfileScreen } from '@/features/profile/screens/ProfileScreen';
import { SleepSoundsScreen } from '@/features/sleep/screens/SleepSoundsScreen';
import { useTheme } from '@/hooks/useTheme';
import type { AppTabsParamList } from '@/types/navigation';

const Tabs = createBottomTabNavigator<AppTabsParamList>();

export function TabsNavigator(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Tabs.Navigator
      tabBar={(props) => <AppBottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: theme.colors.background
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted
      }}
    >
      <Tabs.Screen name="HomeTab" component={HomeScreen} options={{ title: t('navigation.homeTab') }} />
      <Tabs.Screen name="MeditateTab" component={CategoryListScreen} options={{ title: t('navigation.meditateTab') }} />
      <Tabs.Screen name="SleepTab" component={SleepSoundsScreen} options={{ title: t('navigation.sleepTab') }} />
      <Tabs.Screen name="ProfileTab" component={ProfileScreen} options={{ title: t('navigation.profileTab') }} />
    </Tabs.Navigator>
  );
}

export function TabsWithFab(): React.JSX.Element {
  return <TabsNavigator />;
}
