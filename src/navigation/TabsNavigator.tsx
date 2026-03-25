import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { AppBottomTabBar } from '@/components/common/AppBottomTabBar';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { DebtListScreen } from '@/features/debts/screens/DebtListScreen';
import { HomeScreen } from '@/features/home/screens/HomeScreen';
import { SettingsScreen } from '@/features/settings/screens/SettingsScreen';
import { StatisticsScreen } from '@/features/statistics/screens/StatisticsScreen';
import { useTheme } from '@/hooks/useTheme';
import type { AppTabsParamList, RootStackParamList } from '@/types/navigation';

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
      <Tabs.Screen name="DebtsTab" component={DebtListScreen} options={{ title: t('navigation.debtsTab') }} />
      <Tabs.Screen
        name="StatisticsTab"
        component={StatisticsScreen}
        options={{ title: t('navigation.statisticsTab') }}
      />
      <Tabs.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          title: t('navigation.settingsTab')
        }}
      />
    </Tabs.Navigator>
  );
}

export function TabsWithFab(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  return (
    <>
      <TabsNavigator />
      <FloatingActionButton label={t('common.fabAddDebt')} onPress={() => navigation.navigate('AddDebt')} />
    </>
  );
}
