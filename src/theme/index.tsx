import { createContext, useContext, useMemo, type PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';

import { usePreferencesStore } from '@/state/preferences.store';

import { darkTheme } from './dark';
import { lightTheme } from './light';

export type AppTheme = typeof lightTheme | typeof darkTheme;

export type ResolvedThemeMode = AppTheme['mode'];

type ThemeContextValue = {
  theme: AppTheme;
  resolvedMode: ResolvedThemeMode;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  resolvedMode: 'light'
});

export function ThemeProvider({ children }: PropsWithChildren): React.JSX.Element {
  const systemScheme = useColorScheme();
  const preference = usePreferencesStore((state) => state.themePreference);

  const resolvedMode: ResolvedThemeMode =
    preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

  const value = useMemo(
    () => ({
      theme: resolvedMode === 'dark' ? darkTheme : lightTheme,
      resolvedMode
    }),
    [resolvedMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme(): AppTheme {
  return useContext(ThemeContext).theme;
}

export function useResolvedThemeMode(): ResolvedThemeMode {
  return useContext(ThemeContext).resolvedMode;
}

export { appIconMap, type AppIconName } from './icon';
export { darkTheme } from './dark';
export { lightTheme } from './light';
export { motion } from './motion';
export { radius } from './radius';
export { shadows } from './shadows';
export { spacing } from './spacing';
export { typography } from './typography';
