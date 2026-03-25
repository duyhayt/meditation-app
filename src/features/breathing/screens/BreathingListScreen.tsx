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
      heroTitle="Visual breathing rituals"
      heroSubtitle="Breathing gets a brighter, lighter treatment while staying connected to the same design system."
      heroEyebrow="Breathing"
      showBackButton
    >
      <SectionHeader title="Choose a rhythm" description="A stronger card hierarchy helps each exercise feel guided before the timer even starts." />
      {breathingExercises.map((exercise) => (
        <MeditationCard
          key={exercise.id}
          title={exercise.title}
          subtitle={exercise.pattern}
          durationLabel={exercise.durationLabel}
          metaLabel="Breathing"
          imageUri={exercise.coverImageUri}
          tone="breathing"
          onPress={() => navigation.navigate('BreathingSession', { exerciseId: exercise.id })}
        />
      ))}
    </MeditationScreen>
  );
}
