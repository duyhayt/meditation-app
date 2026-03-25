import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { SectionHeader } from '@/components/common/SectionHeader';
import { MeditationCard } from '@/components/meditation/MeditationCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { useBreathingExercisesQuery } from '@/features/content/hooks/use-content-queries';

export function BreathingListScreen({
  navigation
}: {
  navigation: { navigate: (name: 'BreathingSession', params: { exerciseId: string }) => void };
}): React.JSX.Element {
  const { t } = useTranslation();
  const breathingQuery = useBreathingExercisesQuery();
  const exercises = breathingQuery.data ?? [];

  return (
    <MeditationScreen
      title={t('breathing.title')}
      subtitle={t('breathing.subtitle')}
      heroImageUri={exercises[0]?.coverImageUri}
      heroTitle={t('breathing.heroTitle')}
      heroSubtitle={t('breathing.heroSubtitle')}
      heroEyebrow={t('breathing.heroEyebrow')}
      showBackButton
    >
      {breathingQuery.isLoading ? <LoadingState label={t('common.loadingBreathing')} /> : null}
      {breathingQuery.isError ? (
        <EmptyState
          title={t('breathing.title')}
          description={t('common.contentLoadError')}
          actionLabel={t('common.retry')}
          onAction={() => void breathingQuery.refetch()}
        />
      ) : null}
      {!breathingQuery.isLoading && !breathingQuery.isError ? (
        <>
          <SectionHeader title={t('breathing.sectionTitle')} description={t('breathing.sectionDescription')} />
          {exercises.map((exercise) => (
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
        </>
      ) : null}
    </MeditationScreen>
  );
}
