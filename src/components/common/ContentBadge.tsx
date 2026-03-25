import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import type { AppIconName } from '@/theme';

import { AppIcon } from './AppIcon';
import { AppText } from './AppText';

type ContentBadgeProps = {
  label: string;
  icon?: AppIconName;
  tone?: 'default' | 'light';
};

export function ContentBadge({
  label,
  icon,
  tone = 'default'
}: ContentBadgeProps): React.JSX.Element {
  const theme = useTheme();
  const isLight = tone === 'light';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: isLight ? 'rgba(255,255,255,0.16)' : theme.colors.chip,
          borderColor: isLight ? 'rgba(255,255,255,0.18)' : theme.colors.border,
          borderRadius: theme.radius.pill
        }
      ]}
    >
      {icon ? (
        <AppIcon
          name={icon}
          size={theme.iconSize.sm}
          color={isLight ? theme.colors.white : theme.colors.primary}
        />
      ) : null}
      <AppText variant="caption" color={isLight ? theme.colors.white : theme.colors.textSecondary}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderWidth: 1
  }
});
