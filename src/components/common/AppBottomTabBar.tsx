import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { AppIcon } from './AppIcon';
import { AppText } from './AppText';

const routeIconMap = {
  HomeTab: 'home',
  MeditateTab: 'meditate',
  SleepTab: 'moon',
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
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.tabBar,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.xxxl
        }
      ]}
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
            style={({ pressed }) => [
              styles.tab,
              {
                backgroundColor: focused ? theme.colors.surfaceElevated : 'transparent',
                borderRadius: theme.radius.xxl,
                opacity: pressed ? 0.88 : 1
              }
            ]}
          >
            <View
              style={[
                styles.iconWrap,
                {
                  backgroundColor: focused ? theme.colors.chipActive : 'transparent',
                  borderRadius: theme.radius.pill
                }
              ]}
            >
              <AppIcon
                name={routeIconMap[route.name as keyof typeof routeIconMap]}
                color={focused ? theme.colors.primary : theme.colors.iconMuted}
                size={theme.iconSize.md}
              />
            </View>
            <AppText variant="caption" color={focused ? theme.colors.primary : theme.colors.textMuted}>
              {label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    padding: 4,
    borderWidth: 1
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 62,
    paddingVertical: 6
  },
  iconWrap: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
