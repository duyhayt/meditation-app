import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { Screen } from '@/components/ui/Screen';
import { useTheme } from '@/hooks/useTheme';
import { usePreferencesStore } from '@/state/preferences.store';

export function OnboardingScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const completeOnboarding = usePreferencesStore((state) => state.completeOnboarding);

  return (
    <Screen scrollable contentStyle={{ justifyContent: 'center', paddingVertical: theme.spacing.xxxl }}>
      <View style={{ gap: theme.spacing.xl }}>
        <View
          style={{
            gap: theme.spacing.lg,
            padding: theme.spacing.xl,
            borderRadius: theme.radius.xxl,
            backgroundColor: theme.colors.card,
            borderWidth: 1,
            borderColor: theme.colors.border,
            ...theme.shadows.medium
          }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: theme.radius.xl,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.colors.receivableSoft
            }}
          >
            <AppIcon name="debts" size={theme.iconSize.xl} color={theme.colors.receivable} />
          </View>
          <View style={{ gap: theme.spacing.md }}>
            <AppText variant="label">Debt Note App</AppText>
            <AppText variant="display">{t('onboarding.title')}</AppText>
            <AppText variant="subtitle">{t('onboarding.subtitle')}</AppText>
          </View>
        </View>

        <View style={{ gap: theme.spacing.md }}>
          {[
            { icon: 'success', text: t('onboarding.bulletOne') },
            { icon: 'statistics', text: t('onboarding.bulletTwo') },
            { icon: 'sync', text: t('onboarding.bulletThree') }
          ].map((item) => (
            <AppCard key={item.text} elevated>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: theme.radius.lg,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.colors.surfaceSecondary
                  }}
                >
                  <AppIcon name={item.icon as 'success' | 'statistics' | 'sync'} color={theme.colors.primary} />
                </View>
                <AppText variant="bodyStrong" style={{ flex: 1 }}>
                  {item.text}
                </AppText>
              </View>
            </AppCard>
          ))}
        </View>

        <AppButton label={t('onboarding.primaryCta')} onPress={completeOnboarding} />
      </View>
    </Screen>
  );
}
