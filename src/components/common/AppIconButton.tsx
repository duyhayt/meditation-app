import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import type { AppIconName } from '@/theme';

import { AppIcon } from './AppIcon';

type AppIconButtonProps = {
  icon: AppIconName;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  tint?: 'default' | 'light';
};

export function AppIconButton({
  icon,
  onPress,
  style,
  tint = 'default'
}: AppIconButtonProps): React.JSX.Element {
  const theme = useTheme();
  const isLight = tint === 'light';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      hitSlop={10}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isLight ? 'rgba(255,255,255,0.14)' : theme.colors.surface,
          borderColor: isLight ? 'rgba(255,255,255,0.16)' : theme.colors.border,
          borderRadius: theme.radius.pill,
          opacity: pressed ? 0.84 : 1
        },
        style
      ]}
    >
      <AppIcon
        name={icon}
        color={isLight ? theme.colors.white : theme.colors.textPrimary}
        size={theme.iconSize.md}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
