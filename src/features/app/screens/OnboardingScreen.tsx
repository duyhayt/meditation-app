import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { useTheme } from '@/hooks/useTheme';
import { usePreferencesStore } from '@/state/preferences.store';

export function OnboardingScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const completeOnboarding = usePreferencesStore((state) => state.completeOnboarding);

  return (
    <Screen scrollable contentStyle={styles.content}>
      <View
        style={[
          styles.hero,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.xxl,
            padding: theme.spacing.xxl
          }
        ]}
      >
        <AppText variant="label" color={theme.colors.primary}>
          {t('onboarding.eyebrow')}
        </AppText>
        <AppText variant="display">{t('onboarding.title')}</AppText>
        <AppText variant="bodySmall">{t('onboarding.subtitle')}</AppText>
      </View>

      <View style={styles.list}>
        {(['one', 'two', 'three'] as const).map((key) => (
          <View
            key={key}
            style={[
              styles.bullet,
              {
                backgroundColor: theme.colors.surfaceElevated,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.xl,
                padding: theme.spacing.lg
              }
            ]}
          >
            <AppText variant="body">{t(`onboarding.bullets.${key}`)}</AppText>
          </View>
        ))}
      </View>

      <Button label={t('onboarding.primaryCta')} onPress={completeOnboarding} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 20,
    justifyContent: 'center'
  },
  hero: {
    borderWidth: 1,
    gap: 10
  },
  list: {
    gap: 12
  },
  bullet: {
    borderWidth: 1
  }
});
