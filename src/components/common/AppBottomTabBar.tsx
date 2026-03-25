import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { AppIcon } from './AppIcon';
import { AppText } from './AppText';

const routeIconMap = {
  HomeTab: 'home',
  MeditateTab: 'meditate',
  SleepTab: 'sleep',
  ProfileTab: 'profile'
} as const;

export function AppBottomTabBar({
  state,
  descriptors,
  navigation
}: BottomTabBarProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        marginHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
        padding: theme.spacing.sm,
        borderRadius: theme.radius.xxl,
        backgroundColor: theme.colors.tabBar,
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadows.floating
      }}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const descriptor = descriptors[route.key];
        const label =
          typeof descriptor.options.tabBarLabel === 'string'
            ? descriptor.options.tabBarLabel
            : typeof descriptor.options.title === 'string'
              ? descriptor.options.title
              : route.name;

        return (
          <Pressable
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              minHeight: 56,
              borderRadius: theme.radius.xl,
              backgroundColor: focused ? theme.colors.chipActive : 'transparent'
            }}
          >
            <AppIcon
              name={routeIconMap[route.name as keyof typeof routeIconMap]}
              color={focused ? theme.colors.primary : theme.colors.iconMuted}
              size={theme.iconSize.lg}
            />
            <AppText variant="caption" color={focused ? theme.colors.primary : theme.colors.textMuted}>
              {label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
