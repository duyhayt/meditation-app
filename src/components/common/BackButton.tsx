import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { AppIcon } from './AppIcon';

type BackButtonProps = {
  onPress: () => void;
  tint?: 'light' | 'default';
};

export function BackButton({ onPress, tint = 'default' }: BackButtonProps): React.JSX.Element {
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
          borderColor: isLight ? 'rgba(255,255,255,0.18)' : theme.colors.border,
          borderRadius: theme.radius.pill,
          opacity: pressed ? 0.82 : 1
        }
      ]}
    >
      <AppIcon
        name="back"
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
