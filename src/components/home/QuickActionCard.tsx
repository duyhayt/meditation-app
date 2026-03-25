import { Pressable, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import type { AppIconName } from '@/theme';

import { AppIcon } from '../common/AppIcon';
import { AppText } from '../common/AppText';

type QuickActionCardProps = {
  icon: AppIconName;
  title: string;
  subtitle: string;
  onPress: () => void;
};

export function QuickActionCard({
  icon,
  title,
  subtitle,
  onPress
}: QuickActionCardProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        minWidth: 148,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.xl,
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.card,
        opacity: pressed ? 0.9 : 1
      })}
    >
      <View style={{ gap: theme.spacing.md }}>
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
          <AppIcon name={icon} color={theme.colors.primary} />
        </View>
        <View style={{ gap: theme.spacing.xs }}>
          <AppText variant="title">{title}</AppText>
          <AppText variant="bodySmall">{subtitle}</AppText>
        </View>
      </View>
    </Pressable>
  );
}
