import { useTranslation } from 'react-i18next';

import { FeatureCard } from '@/components/meditation/FeatureCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { breathingExercises } from '@/features/meditation/data/phase-one-content';

export function BreathingListScreen({ navigation }: { navigation: { navigate: (name: 'BreathingSession', params: { exerciseId: string }) => void } }): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <MeditationScreen eyebrow="S08" title={t('breathing.title')} subtitle={t('breathing.subtitle')}>
      {breathingExercises.map((exercise) => (
        <FeatureCard
          key={exercise.id}
          icon="breath"
          eyebrow={exercise.durationLabel}
          title={exercise.title}
          description={exercise.pattern}
          meta="Open session"
          onPress={() => navigation.navigate('BreathingSession', { exerciseId: exercise.id })}
        />
      ))}
    </MeditationScreen>
  );
}
