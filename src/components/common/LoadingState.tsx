import { ActivityIndicator, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { AppCard } from './AppCard';
import { AppText } from './AppText';
import { SkeletonBlock } from './SkeletonBlock';

type LoadingStateProps = {
  label?: string;
  variant?: 'spinner' | 'dashboard' | 'list' | 'detail' | 'form';
};

export function LoadingState({ label, variant = 'spinner' }: LoadingStateProps): React.JSX.Element {
  const theme = useTheme();

  if (variant !== 'spinner') {
    return (
      <View style={{ gap: theme.spacing.lg }}>
        {variant === 'dashboard' ? (
          <>
            <AppCard elevated>
              <View style={{ gap: theme.spacing.md }}>
                <SkeletonBlock width={88} />
                <SkeletonBlock height={32} width="75%" />
                <SkeletonBlock height={18} width="55%" />
              </View>
            </AppCard>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md }}>
              {Array.from({ length: 4 }).map((_, index) => (
                <AppCard key={index} style={{ flex: 1, minWidth: 150 }}>
                  <View style={{ gap: theme.spacing.md }}>
                    <SkeletonBlock width={42} height={42} radius={theme.radius.lg} />
                    <SkeletonBlock width="70%" />
                    <SkeletonBlock width="45%" />
                  </View>
                </AppCard>
              ))}
            </View>
          </>
        ) : null}

        {variant === 'list'
          ? Array.from({ length: 5 }).map((_, index) => (
              <AppCard key={index}>
                <View style={{ gap: theme.spacing.md }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: theme.spacing.md }}>
                    <View style={{ flex: 1, gap: theme.spacing.sm }}>
                      <SkeletonBlock width="58%" height={20} />
                      <SkeletonBlock width="36%" />
                    </View>
                    <SkeletonBlock width={88} height={28} radius={theme.radius.pill} />
                  </View>
                  <SkeletonBlock width="72%" />
                  <SkeletonBlock width="100%" height={8} radius={theme.radius.pill} />
                </View>
              </AppCard>
            ))
          : null}

        {variant === 'detail' ? (
          <>
            <AppCard elevated>
              <View style={{ gap: theme.spacing.md }}>
                <SkeletonBlock width="40%" />
                <SkeletonBlock width="65%" height={30} />
                <SkeletonBlock width="100%" height={10} radius={theme.radius.pill} />
              </View>
            </AppCard>
            <AppCard>
              <View style={{ gap: theme.spacing.md }}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonBlock key={index} width="100%" height={18} />
                ))}
              </View>
            </AppCard>
          </>
        ) : null}

        {variant === 'form' ? (
          <AppCard elevated>
            <View style={{ gap: theme.spacing.lg }}>
              {Array.from({ length: 5 }).map((_, index) => (
                <View key={index} style={{ gap: theme.spacing.sm }}>
                  <SkeletonBlock width="28%" />
                  <SkeletonBlock width="100%" height={54} radius={theme.radius.lg} />
                </View>
              ))}
              <SkeletonBlock width="100%" height={52} radius={theme.radius.lg} />
            </View>
          </AppCard>
        ) : null}

        {label ? <AppText variant="bodySmall">{label}</AppText> : null}
      </View>
    );
  }

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
        <ActivityIndicator color={theme.colors.primary} size="large" />
        {label ? <AppText variant="bodySmall">{label}</AppText> : null}
      </AppCard>
    </View>
  );
}
