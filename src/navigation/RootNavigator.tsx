import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationLightTheme,
  NavigationContainer
} from '@react-navigation/native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { SplashScreen } from '@/features/app/screens/SplashScreen';
import { useTheme } from '@/hooks/useTheme';
import { usePreferencesStore } from '@/state/preferences.store';

import { ProtectedNavigator } from './ProtectedNavigator';
import { PublicNavigator } from './PublicNavigator';

export function RootNavigator(): React.JSX.Element {
  const theme = useTheme();
  const { t } = useTranslation();
  const hasHydrated = usePreferencesStore((state) => state.hasHydrated);
  const hasCompletedOnboarding = usePreferencesStore((state) => state.hasCompletedOnboarding);

  const navigationTheme = useMemo(() => {
    const baseTheme = theme.mode === 'dark' ? NavigationDarkTheme : NavigationLightTheme;

    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        background: theme.colors.background,
        border: theme.colors.border,
        card: theme.colors.surface,
        notification: theme.colors.primary,
        primary: theme.colors.primary,
        text: theme.colors.text
      }
    };
  }, [theme]);

  if (!hasHydrated) {
    return <SplashScreen title={t('splash.title')} subtitle={t('splash.subtitle')} />;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {hasCompletedOnboarding ? <ProtectedNavigator /> : <PublicNavigator />}
    </NavigationContainer>
  );
}
