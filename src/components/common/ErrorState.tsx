import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { AppButton } from './AppButton';
import { AppCard } from './AppCard';
import { AppIcon } from './AppIcon';
import { AppText } from './AppText';

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps): React.JSX.Element {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <AppCard
        style={{
          alignItems: 'center',
          gap: theme.spacing.md,
          paddingVertical: theme.spacing.xxxl
        }}
        elevated
      >
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: theme.radius.xl,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.overdueSoft
          }}
        >
          <AppIcon name="error" size={theme.iconSize.xl} color={theme.colors.overdue} />
        </View>
        <View style={{ gap: theme.spacing.xs, alignItems: 'center' }}>
          <AppText variant="title">{t('common.genericErrorTitle')}</AppText>
          <AppText variant="bodySmall" style={{ textAlign: 'center' }}>
            {message}
          </AppText>
        </View>
        {onRetry ? <AppButton label={t('common.retry')} onPress={onRetry} fullWidth={false} /> : null}
      </AppCard>
    </View>
  );
}
