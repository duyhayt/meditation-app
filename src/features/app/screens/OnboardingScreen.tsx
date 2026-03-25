import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { HeroCard } from '@/components/common/HeroCard';
import { SectionHeader } from '@/components/common/SectionHeader';
import { MeditationCard } from '@/components/meditation/MeditationCard';
import { Screen } from '@/components/ui/Screen';
import { mediaLibrary } from '@/features/meditation/data/phase-one-content';
import { usePreferencesStore } from '@/state/preferences.store';

export function OnboardingScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const completeOnboarding = usePreferencesStore((state) => state.completeOnboarding);

  return (
    <Screen scrollable contentStyle={styles.content}>
      <HeroCard
        imageUri={mediaLibrary.silhouette}
        eyebrow={t('onboarding.eyebrow')}
        title={t('onboarding.title')}
        subtitle={t('onboarding.subtitle')}
        secondaryLabel={t('onboarding.secondaryLabel')}
      />

      <SectionHeader title={t('onboarding.sectionTitle')} description={t('onboarding.sectionDescription')} />
      <MeditationCard
        title={t('onboarding.bullets.one')}
        subtitle={t('onboarding.bullets.two')}
        durationLabel={t('onboarding.cardOneDuration')}
        metaLabel={t('onboarding.cardOneMeta')}
        imageUri={mediaLibrary.sunriseMeditation}
      />
      <MeditationCard
        title={t('onboarding.bullets.three')}
        subtitle={t('onboarding.cardTwoSubtitle')}
        durationLabel={t('onboarding.cardTwoDuration')}
        metaLabel={t('onboarding.cardTwoMeta')}
        imageUri={mediaLibrary.moonSky}
        tone="course"
      />

      <View style={styles.footer}>
        <AppButton label={t('onboarding.primaryCta')} iconLeft="arrowRight" onPress={completeOnboarding} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 20,
    justifyContent: 'center'
  },
  footer: {
    paddingTop: 8
  }
});
