import { View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { AppButton } from './AppButton';
import { AppCard } from './AppCard';
import { AppIcon } from './AppIcon';
import { AppText } from './AppText';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <AppCard
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.md,
        paddingVertical: theme.spacing.xxxl
      }}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: theme.radius.xl,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.surfaceSecondary
        }}
      >
        <AppIcon name="empty" size={theme.iconSize.xl} color={theme.colors.iconMuted} />
      </View>
      <View style={{ gap: theme.spacing.xs, alignItems: 'center' }}>
        <AppText variant="title" style={{ textAlign: 'center' }}>
          {title}
        </AppText>
        <AppText variant="bodySmall" style={{ textAlign: 'center' }}>
          {description}
        </AppText>
      </View>
      {actionLabel && onAction ? <AppButton label={actionLabel} onPress={onAction} fullWidth={false} /> : null}
    </AppCard>
  );
}
