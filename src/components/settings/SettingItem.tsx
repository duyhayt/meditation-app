import { Pressable, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import type { AppIconName } from '@/theme';

import { AppIcon } from '../common/AppIcon';
import { AppText } from '../common/AppText';

type SettingItemProps = {
  icon: AppIconName;
  title: string;
  description?: string;
  onPress?: () => void;
  trailingText?: string;
};

export function SettingItem({
  icon,
  title,
  description,
  onPress,
  trailingText
}: SettingItemProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
        borderRadius: theme.radius.lg,
        paddingVertical: theme.spacing.md,
        opacity: pressed ? 0.85 : 1
      })}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: theme.radius.lg,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.surfaceSecondary
        }}
      >
        <AppIcon name={icon} size={theme.iconSize.md} color={theme.colors.primary} />
      </View>
      <View style={{ flex: 1, gap: theme.spacing.xs }}>
        <AppText variant="bodyStrong">{title}</AppText>
        {description ? <AppText variant="bodySmall">{description}</AppText> : null}
      </View>
      {trailingText ? <AppText variant="caption">{trailingText}</AppText> : null}
      <AppIcon name="chevronRight" size={theme.iconSize.md} color={theme.colors.iconMuted} />
    </Pressable>
  );
}
