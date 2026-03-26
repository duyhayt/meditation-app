import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { AppCard } from './AppCard';
import { AppText } from './AppText';

type LoadingStateProps = {
  label?: string;
  variant?: 'spinner' | 'dashboard' | 'list' | 'detail' | 'form';
};

export function LoadingState({ label }: LoadingStateProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <AppCard elevated style={styles.card}>
      <View
        style={[
          styles.indicatorWrap,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.pill
          }
        ]}
      >
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </View>
      {label ? (
        <AppText variant="bodySmall" color={theme.colors.textSecondary}>
          {label}
        </AppText>
      ) : null}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    minHeight: 180
  },
  indicatorWrap: {
    width: 72,
    height: 72,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
