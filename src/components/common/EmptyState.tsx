import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { AppButton } from './AppButton';
import { AppIcon } from './AppIcon';
import { AppText } from './AppText';
import { AppCard } from './AppCard';

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
    <AppCard elevated style={styles.card}>
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.pill
          }
        ]}
      >
        <AppIcon name="sparkles" color={theme.colors.primary} size={theme.iconSize.xl} />
      </View>
      <View style={styles.copy}>
        <AppText variant="heading2">{title}</AppText>
        <AppText variant="bodySmall">{description}</AppText>
      </View>
      {actionLabel && onAction ? (
        <AppButton label={actionLabel} onPress={onAction} fullWidth={false} />
      ) : null}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'flex-start',
    gap: 16,
    paddingVertical: 24
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  copy: {
    gap: 8
  }
});
