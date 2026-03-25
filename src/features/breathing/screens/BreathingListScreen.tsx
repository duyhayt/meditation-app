import { useTranslation } from 'react-i18next';

import { SectionHeader } from '@/components/common/SectionHeader';
import { MeditationCard } from '@/components/meditation/MeditationCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { breathingExercises } from '@/features/meditation/data/phase-one-content';

export function BreathingListScreen({
  navigation
}: {
  navigation: { navigate: (name: 'BreathingSession', params: { exerciseId: string }) => void };
}): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <MeditationScreen
      title={t('breathing.title')}
      subtitle={t('breathing.subtitle')}
      heroImageUri={breathingExercises[0]?.coverImageUri}
      heroTitle={t('breathing.heroTitle')}
      heroSubtitle={t('breathing.heroSubtitle')}
      heroEyebrow={t('breathing.heroEyebrow')}
      showBackButton
    >
      <SectionHeader title={t('breathing.sectionTitle')} description={t('breathing.sectionDescription')} />
      {breathingExercises.map((exercise) => (
        <MeditationCard
          key={exercise.id}
          title={exercise.title}
          subtitle={exercise.pattern}
          durationLabel={exercise.durationLabel}
          metaLabel={t('breathing.cardMeta')}
          imageUri={exercise.coverImageUri}
          tone="breathing"
          onPress={() => navigation.navigate('BreathingSession', { exerciseId: exercise.id })}
        />
      ))}
    </MeditationScreen>
  );
}
